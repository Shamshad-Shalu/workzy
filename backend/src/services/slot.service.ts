import dayjs from "dayjs";
import { inject } from "inversify";
import { Types } from "mongoose";

import redisClient from "@/config/redisClient";
import {
  CATEGORY,
  HTTPSTATUS,
  PRICING_MODE,
  SERVICE,
  SERVICE_TYPE,
  SLOT,
  WORKER,
} from "@/constants";
import { SLOT_STATUS } from "@/constants/booking";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { CreateSlotDTO } from "@/dtos/requests/slot.dto";
import { ICategory } from "@/types/category";
import { IService } from "@/types/service";
import { AvailableSlot, GetAvailableDatesDTO, GetSlotsDTO } from "@/types/slot";
import { Day, IWorker } from "@/types/worker";
import CustomError from "@/utils/customError";

const RESERVATION_TTL_SECONDS = 15 * 60;

export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository
  ) {}

  async getAvailableDates(dto: GetAvailableDatesDTO): Promise<Record<string, boolean>> {
    const { workerId, serviceId, lat, lng, itemCount = 1 } = dto;

    const { worker, service, category } = await this.getSlotContext(workerId, serviceId);

    const serviceDuration = this.resolveServiceDuration(service, category, itemCount);
    const bufferTime = service.bufferTime ?? category.bufferTime ?? 15;
    const isRemote = category.serviceType === SERVICE_TYPE.REMOTE;
    const allowSudden = service.allowSuddenBooking ?? false;

    const earliest = this.getEarliestBookableDate(allowSudden);
    const today = dayjs().startOf("day");
    const rangeEnd = today.add(30, "day");
    const userLocation = !isRemote && lat !== undefined && lng !== undefined ? { lat, lng } : null;

    const allOccupied = await this._slotRepository.getOccupiedSlots(
      workerId,
      today.toDate(),
      rangeEnd.toDate()
    );

    const result: Record<string, boolean> = {};

    for (let i = 0; i <= 30; i++) {
      const current = today.add(i, "day");
      const dateStr = current.format("YYYY-MM-DD");

      if (current.isBefore(earliest, "day")) {
        result[dateStr] = false;
        continue;
      }
      const dayName = current.format("dddd").toLowerCase() as Day;
      const dayWindows = worker.availability[dayName];
      if (!dayWindows || dayWindows.length === 0) {
        result[dateStr] = false;
        continue;
      }
      const dayOccupied = allOccupied.filter((s) => dayjs(s.date).format("YYYY-MM-DD") === dateStr);

      const bookedSlots = dayOccupied.map((s) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        location: s.location?.coordinates
          ? { lat: s.location.coordinates[1], lng: s.location.coordinates[0] }
          : null,
      }));

      let hasSlot = false;
      for (const win of dayWindows) {
        const slots = this.generateAvailableSlots({
          availability: { start: win.startTime, end: win.endTime },
          bookedSlots,
          serviceDuration,
          bufferTime,
          isRemote,
          userLocation,
        });
        if (slots.length > 0) {
          hasSlot = true;
          break;
        }
      }
      result[dateStr] = hasSlot;
    }
    return result;
  }

  async cleanupExpired(): Promise<number> {
    return await this._slotRepository.cleanupExpiredReservations();
  }

  async reserveSlot(
    userId: string,
    data: CreateSlotDTO
  ): Promise<{ slotId: string; reservedUntil: Date }> {
    const { workerId, serviceId, date, startTime, lat, lng, itemCount = 1 } = data;

    const lockKey = `slot:${workerId}:${dayjs(date).format("YYYY-MM-DD")}:${startTime}`;
    const existing = await redisClient.get(lockKey);
    if (existing) throw new CustomError(SLOT.EXISTS, HTTPSTATUS.CONFLICT);

    const availableSlots = await this.getAvailableSlots({
      workerId,
      serviceId,
      date,
      lat,
      lng,
      itemCount,
    });
    const slot = availableSlots.find((s) => s.startTime === startTime);
    if (!slot) throw new CustomError(SLOT.NOT_AVAILABLE, HTTPSTATUS.CONFLICT);

    const { service, category } = await this.getSlotContext(workerId, serviceId);

    const serviceDuration = this.resolveServiceDuration(service!, category!, itemCount);
    const bufferTime = service!.bufferTime ?? category!.bufferTime ?? 15;
    const isRemote = category!.serviceType === SERVICE_TYPE.REMOTE;
    const reservedUntil = new Date(Date.now() + RESERVATION_TTL_SECONDS * 1000);

    const newSlot = await this._slotRepository.create({
      workerId: new Types.ObjectId(workerId),
      serviceId: new Types.ObjectId(serviceId),
      date,
      startTime,
      endTime: slot.endTime,
      status: SLOT_STATUS.RESERVED,
      location:
        !isRemote && lat !== undefined && lng !== undefined
          ? { type: "Point", coordinates: [lng, lat] }
          : null,
      travelFromPrev: slot.travelFromPrev,
      serviceDuration,
      bufferTime,
      reservedBy: new Types.ObjectId(userId),
      reservedUntil,
    });
    await redisClient.set(lockKey, workerId, { EX: RESERVATION_TTL_SECONDS });
    return {
      slotId: newSlot._id.toString(),
      reservedUntil,
    };
  }

  async getAvailableSlots(dto: GetSlotsDTO): Promise<AvailableSlot[]> {
    const { date, serviceId, workerId, lat, lng, itemCount = 1 } = dto;
    const { worker, service, category } = await this.getSlotContext(workerId, serviceId);

    const serviceDuration = this.resolveServiceDuration(service, category, itemCount);
    const bufferTime = service.bufferTime ?? category.bufferTime ?? 15;
    const isRemote = category.serviceType === SERVICE_TYPE.REMOTE;

    const dayName = dayjs(date).format("dddd").toLowerCase() as Day;
    const daySlots = worker.availability[dayName];

    if (!daySlots || daySlots.length === 0) return [];
    const start = dayjs(date).startOf("day").toDate();
    const end = dayjs(date).endOf("day").toDate();

    const occupiedSlots = await this._slotRepository.getOccupiedSlots(workerId, start, end);

    // bookedJobs
    const bookedSlots = occupiedSlots.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location?.coordinates
        ? {
            lat: s.location.coordinates[1],
            lng: s.location.coordinates[0],
          }
        : null,
    }));
    const userLocation = !isRemote && lat !== undefined && lng !== undefined ? { lat, lng } : null;
    const allSlots: AvailableSlot[] = [];
    for (const slot of daySlots) {
      const slots = this.generateAvailableSlots({
        availability: { start: slot.startTime, end: slot.endTime },
        bookedSlots,
        serviceDuration,
        bufferTime,
        isRemote,
        userLocation,
      });
      allSlots.push(...slots);
    }
    return allSlots;
  }

  async releaseSlot(slotId: string, userId: string): Promise<boolean> {
    const slot = await this._slotRepository.findById(slotId);
    if (!slot) return true;
    await this._slotRepository.findOneAndDelete({
      _id: new Types.ObjectId(slotId),
      reservedBy: new Types.ObjectId(userId),
      status: SLOT_STATUS.RESERVED,
    });
    const lockKey = `slot:${slot.workerId}:${dayjs(slot.date).format("YYYY-MM-DD")}:${slot.startTime}`;
    await redisClient.del(lockKey);
    return true;
  }

  private async getSlotContext(
    workerId: string,
    serviceId: string
  ): Promise<{ service: IService; worker: IWorker; category: ICategory }> {
    const [service, worker] = await Promise.all([
      this._serviceRepository.findById(serviceId),
      this._workerRepository.findById(workerId),
    ]);
    if (!service) {
      throw new CustomError(SERVICE.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const category = await this._categoryRepository.findById(service.categoryId.toString());
    if (!category) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    return { service, worker, category };
  }

  private generateAvailableSlots(input: {
    availability: { start: string; end: string };
    bookedSlots: {
      startTime: string;
      endTime: string;
      location: { lat: number; lng: number } | null;
    }[];
    serviceDuration: number;
    bufferTime: number;
    isRemote: boolean;
    userLocation: { lat: number; lng: number } | null;
  }): AvailableSlot[] {
    const { availability, bookedSlots, serviceDuration, bufferTime, isRemote, userLocation } =
      input;

    const totalBlock = serviceDuration + bufferTime;
    const dayStart = this.toMin(availability.start);
    const dayEnd = this.toMin(availability.end);
    const INCREMENT = 30;

    const jobs = [...bookedSlots].sort((a, b) => this.toMin(a.startTime) - this.toMin(b.startTime));

    type Window = {
      windowStart: number;
      windowEnd: number;
      prevLoc: { lat: number; lng: number } | null;
      nextLoc: { lat: number; lng: number } | null;
    };

    const windows: Window[] = [];

    windows.push({
      windowStart: dayStart,
      windowEnd: jobs.length > 0 ? this.toMin(jobs[0].startTime) : dayEnd,
      prevLoc: null,
      nextLoc: jobs.length > 0 ? jobs[0].location : null,
    });

    for (let i = 0; i < jobs.length - 1; i++) {
      windows.push({
        windowStart: this.toMin(jobs[i].endTime),
        windowEnd: this.toMin(jobs[i + 1].startTime),
        prevLoc: jobs[i].location,
        nextLoc: jobs[i + 1].location,
      });
    }

    if (jobs.length > 0) {
      windows.push({
        windowStart: this.toMin(jobs[jobs.length - 1].endTime),
        windowEnd: dayEnd,
        prevLoc: jobs[jobs.length - 1].location,
        nextLoc: null,
      });
    }

    const result: AvailableSlot[] = [];

    for (const win of windows) {
      const tIn = isRemote ? 0 : this.travelMin(win.prevLoc, userLocation);
      const tOut = isRemote ? 0 : this.travelMin(userLocation, win.nextLoc);
      const earliest = win.windowStart + tIn;
      const latest = win.windowEnd - totalBlock - tOut;

      let cursor = Math.ceil(earliest / INCREMENT) * INCREMENT;

      while (cursor <= latest) {
        result.push({
          startTime: this.fromMin(cursor),
          endTime: this.fromMin(cursor + totalBlock),
          travelFromPrev: tIn,
        });
        cursor += INCREMENT;
      }
    }
    return result;
  }

  private getEarliestBookableDate(allowSuddenBooking: boolean): dayjs.Dayjs {
    const now = dayjs();
    if (allowSuddenBooking) return now;
    const daysToAdd = now.hour() >= 18 ? 2 : 1;
    return now.add(daysToAdd, "day").startOf("day");
  }

  private resolveServiceDuration(
    service: IService,
    category: ICategory,
    itemCount: number
  ): number {
    const baseDuration = service.estimatedDuration ?? category.estimatedDuration ?? 60;
    if (category.pricingMode === PRICING_MODE.PER_UNIT) {
      return baseDuration * itemCount;
    }
    return baseDuration;
  }

  private toMin(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }
  private fromMin(n: number): string {
    return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  }

  private haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(x));
  }

  private travelMin(
    from: { lat: number; lng: number } | null,
    to: { lat: number; lng: number } | null
  ): number {
    if (!from || !to) return 0;
    const km = this.haversineKm(from, to);
    const raw = km * 3;
    return Math.ceil(raw / 10) * 10;
  }
}
