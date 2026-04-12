import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { CATEGORY, HTTPSTATUS, PRICING_MODE, SERVICE, SLOT, WORKER } from "@/constants";
import { SLOT_STATUS } from "@/constants/booking";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { ILeaveRepository } from "@/core/interfaces/repositories/ILeaveRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IRedisService } from "@/core/interfaces/services/IRedisService";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { CreateQuoteSlotsDTO, CreateSlotDTO } from "@/dtos/requests/slot.dto";
import { ICategory } from "@/types/category";
import { IService } from "@/types/service";
import { AvailableSlot, GetAvailableDatesDTO, GetSlotsDTO, ISlot } from "@/types/slot";
import { Day, IWorker } from "@/types/worker";
import CustomError from "@/utils/customError";
import { calculateDistanceKm } from "@/utils/geo";
import { minutesToTime, timeToMinutes } from "@/utils/time.convert";

const RESERVATION_TTL_SECONDS = 15 * 60;
const QUOTE_TTL_SECONDS = 24 * 60 * 60;
@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.LeaveRepository) private _leaveRepository: ILeaveRepository,
    @inject(TYPES.RedisService) private _redisService: IRedisService
  ) {}

  async getAvailableDates(dto: GetAvailableDatesDTO): Promise<Record<string, boolean>> {
    const { workerId, serviceId, lat, lng, itemCount = 1 } = dto;

    const today = dayjs().startOf("day");
    const rangeEnd = today.add(30, "day");

    const [{ worker, service, category }, allOccupied, leaves] = await Promise.all([
      this.getSlotContext(workerId, serviceId),
      this._slotRepository.getOccupiedSlots(workerId, today.toDate(), rangeEnd.toDate()),
      this._leaveRepository.getActiveLeaves(workerId, today.toDate(), rangeEnd.toDate()),
    ]);
    console.log("Occupied:", allOccupied.length);
    console.log("Leaves:", leaves.length);

    const duration = this.resolveDuration(service, category, itemCount);
    const allowSudden = service.allowSuddenBooking ?? false;
    const userLocation = { lat, lng };
    const workerLocation = {
      lat: worker.location.coordinates[1],
      lng: worker.location.coordinates[0],
    };
    const earliest = this.getEarliestBookableDate(allowSudden);

    const occupiedByDate = new Map<string, typeof allOccupied>();
    for (const s of allOccupied) {
      const key = dayjs(s.date).format("YYYY-MM-DD");
      if (!occupiedByDate.has(key)) occupiedByDate.set(key, []);
      occupiedByDate.get(key)!.push(s);
    }

    const leaveRanges = leaves.map((l) => ({
      start: dayjs(l.startDate).startOf("day"),
      end: dayjs(l.endDate).startOf("day"),
    }));

    const result: Record<string, boolean> = {};

    for (let i = 0; i <= 30; i++) {
      const current = today.add(i, "day");
      const dateStr = current.format("YYYY-MM-DD");

      if (current.isBefore(earliest, "day")) {
        result[dateStr] = false;
        continue;
      }
      const isOnLeave = leaveRanges.some(
        (l) => !current.isBefore(l.start, "day") && !current.isAfter(l.end, "day")
      );
      if (isOnLeave) {
        result[dateStr] = false;
        continue;
      }

      const dayName = current.format("dddd").toLowerCase() as Day;
      const dayWindows = worker.availability[dayName];
      if (!dayWindows || dayWindows.length === 0) {
        result[dateStr] = false;
        continue;
      }

      const dayOccupied = occupiedByDate.get(dateStr) ?? [];
      const hasFullDay = dayOccupied.some((s) => s.isFullDay);
      if (hasFullDay) {
        result[dateStr] = false;
        continue;
      }
      const isToday = current.isSame(dayjs(), "day");
      const bookedSlots = this.mapOccupied(dayOccupied);

      let hasSlot = false;
      for (const win of dayWindows) {
        const slots = this.generateAvailableSlots({
          availability: { start: win.startTime, end: win.endTime },
          bookedSlots,
          duration,
          userLocation,
          workerLocation,
          isToday,
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

  async getAvailableSlots(dto: GetSlotsDTO): Promise<AvailableSlot[]> {
    const { date, serviceId, workerId, lat, lng, itemCount = 1 } = dto;
    const [{ category, service, worker }, leaves] = await Promise.all([
      this.getSlotContext(workerId, serviceId),
      this._leaveRepository.getActiveLeaves(workerId, date, date),
    ]);
    if (leaves.length > 0) return [];

    const dayName = dayjs(date).format("dddd").toLowerCase() as Day;
    const dayWindows = worker.availability[dayName];
    if (!dayWindows || dayWindows.length === 0) return [];

    const duration = this.resolveDuration(service, category, itemCount);
    const userLocation = { lat, lng };
    const workerLocation = {
      lat: worker.location.coordinates[1],
      lng: worker.location.coordinates[0],
    };
    const isToday = dayjs(date).isSame(dayjs(), "day");

    const occupiedSlots = await this._slotRepository.getOccupiedSlots(
      workerId,
      dayjs(date).startOf("day").toDate(),
      dayjs(date).endOf("day").toDate()
    );
    if (occupiedSlots.some((s) => s.isFullDay)) return [];
    const bookedSlots = this.mapOccupied(occupiedSlots);

    const allSlots: AvailableSlot[] = [];
    for (const win of dayWindows) {
      const slots = this.generateAvailableSlots({
        availability: { start: win.startTime, end: win.endTime },
        bookedSlots,
        duration,
        userLocation,
        workerLocation,
        isToday,
      });
      allSlots.push(...slots);
    }
    return allSlots;
  }
  async reserveSlot(
    userId: string,
    data: CreateSlotDTO
  ): Promise<{ slotId: string; reservedUntil: Date }> {
    const { workerId, serviceId, date, startTime, lat, lng, itemCount = 1 } = data;

    const lockKey = `slot:${workerId}:${dayjs(date).format("YYYY-MM-DD")}:${startTime}`;
    const existing = await this._redisService.get(lockKey);
    if (existing) throw new CustomError(SLOT.EXISTS, HTTPSTATUS.CONFLICT);

    const { service, category } = await this.getSlotContext(workerId, serviceId);
    const availableSlots = await this.getAvailableSlots({
      workerId,
      serviceId,
      date,
      lat,
      lng,
      itemCount,
    });
    const duration = this.resolveDuration(service, category, itemCount);

    const slot = availableSlots.find((s) => s.startTime === startTime);
    if (!slot) throw new CustomError(SLOT.NOT_AVAILABLE, HTTPSTATUS.CONFLICT);

    const reservedUntil = new Date(Date.now() + RESERVATION_TTL_SECONDS * 1000);

    const newSlot = await this._slotRepository.create({
      workerId: new Types.ObjectId(workerId),
      serviceId: new Types.ObjectId(serviceId),
      date,
      startTime,
      endTime: slot.endTime,
      isFullDay: false,
      duration,
      status: SLOT_STATUS.RESERVED,
      location: { type: "Point", coordinates: [lng, lat] },
      travelFromPrev: slot.travelFromPrev,
      reservedBy: new Types.ObjectId(userId),
      reservedUntil,
    });
    await this._redisService.setWithTTL(lockKey, workerId, RESERVATION_TTL_SECONDS);
    return {
      slotId: newSlot._id.toString(),
      reservedUntil,
    };
  }

  async reserveQuoteSlots(
    workerId: string,
    data: CreateQuoteSlotsDTO
  ): Promise<{ slotIds: string[]; reservedUntil: Date }> {
    const { serviceId, dates, lat, lng } = data;

    const { worker } = await this.getSlotContext(workerId, serviceId);
    const reservedUntil = new Date(Date.now() + QUOTE_TTL_SECONDS * 1000);

    const createdIds: string[] = [];
    const acquiredLocks: string[] = [];

    try {
      for (const date of dates) {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        const lockKey = `slot:${workerId}:${dateStr}:fullday`;

        const existing = await this._redisService.get(lockKey);
        if (existing) throw new CustomError(SLOT.EXISTS, HTTPSTATUS.CONFLICT);

        const dayName = dayjs(date).format("dddd").toLowerCase() as Day;
        const dayWindows = worker.availability[dayName];
        if (!dayWindows || dayWindows.length === 0)
          throw new CustomError(SLOT.NOT_AVAILABLE, HTTPSTATUS.BAD_REQUEST);

        const startTime = dayWindows[0].startTime;
        const endTime = dayWindows[dayWindows.length - 1].endTime;

        const newSlot = await this._slotRepository.create({
          workerId: new Types.ObjectId(workerId),
          serviceId: new Types.ObjectId(serviceId),
          date,
          startTime,
          endTime,
          isFullDay: true,
          duration: 0,
          status: SLOT_STATUS.RESERVED,
          location: { type: "Point", coordinates: [lng, lat] },
          reservedBy: new Types.ObjectId(workerId),
          travelFromPrev: 0,
          reservedUntil,
        });

        await this._redisService.setWithTTL(lockKey, workerId, QUOTE_TTL_SECONDS);
        acquiredLocks.push(lockKey);
        createdIds.push(newSlot._id.toString());
      }
    } catch (err) {
      if (createdIds.length > 0) await this._slotRepository.deleteManyByIds(createdIds);
      await this._redisService.deleteMany(acquiredLocks);
      throw err;
    }
    return { slotIds: createdIds, reservedUntil };
  }

  async releaseQuoteSlots(slotIds: string[]): Promise<boolean> {
    const slots = await this._slotRepository.findManyByIds(slotIds);
    await this._slotRepository.deleteManyByIds(slotIds);
    const lockKeys = slots.map(
      (s) => `slot:${s.workerId}:${dayjs(s.date).format("YYYY-MM-DD")}:fullday`
    );
    await this._redisService.deleteMany(lockKeys);

    return true;
  }

  async releaseSlot(slotId: string, userId: string): Promise<boolean> {
    const slot = await this._slotRepository.findOneAndDelete({
      _id: new Types.ObjectId(slotId),
      reservedBy: new Types.ObjectId(userId),
      status: SLOT_STATUS.RESERVED,
    });
    if (!slot) return true;
    const lockKey = `slot:${slot.workerId}:${dayjs(slot.date).format("YYYY-MM-DD")}:${slot.startTime}`;
    await this._redisService.delete(lockKey);
    return true;
  }

  async cleanupExpired(): Promise<number> {
    return await this._slotRepository.cleanupExpiredReservations();
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
      location: { lat: number; lng: number };
    }[];
    duration: number;
    workerLocation: { lat: number; lng: number };
    userLocation: { lat: number; lng: number };
    isToday: boolean;
  }): AvailableSlot[] {
    const { availability, bookedSlots, duration, userLocation, workerLocation, isToday } = input;

    const INCREMENT = 30;
    const PREP_BUFFER = 15;
    const dayStart = timeToMinutes(availability.start);
    const dayEnd = timeToMinutes(availability.end);

    const jobs = [...bookedSlots].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    type Window = {
      windowStart: number;
      windowEnd: number;
      prevLoc: { lat: number; lng: number } | null;
      nextLoc: { lat: number; lng: number } | null;
    };

    const windows: Window[] = [];

    windows.push({
      windowStart: dayStart,
      windowEnd: jobs.length > 0 ? timeToMinutes(jobs[0].startTime) : dayEnd,
      prevLoc: isToday ? workerLocation : null,
      nextLoc: jobs.length > 0 ? jobs[0].location : null,
    });

    for (let i = 0; i < jobs.length - 1; i++) {
      windows.push({
        windowStart: timeToMinutes(jobs[i].endTime),
        windowEnd: timeToMinutes(jobs[i + 1].startTime),
        prevLoc: jobs[i].location,
        nextLoc: jobs[i + 1].location,
      });
    }

    if (jobs.length > 0) {
      windows.push({
        windowStart: timeToMinutes(jobs[jobs.length - 1].endTime),
        windowEnd: dayEnd,
        prevLoc: jobs[jobs.length - 1].location,
        nextLoc: null,
      });
    }

    const result: AvailableSlot[] = [];

    for (const win of windows) {
      const tIn = this.travelMin(win.prevLoc, userLocation);
      const tOut = this.travelMin(userLocation, win.nextLoc);
      const earliest = win.windowStart + tIn;
      const latest = win.windowEnd - duration - tOut;

      const effectiveEarliest = isToday
        ? Math.max(earliest, timeToMinutes(dayjs().format("HH:mm")) + PREP_BUFFER + tIn)
        : earliest;

      let cursor = Math.ceil(effectiveEarliest / INCREMENT) * INCREMENT;

      while (cursor <= latest) {
        result.push({
          startTime: minutesToTime(cursor),
          endTime: minutesToTime(cursor + duration),
          travelFromPrev: tIn,
        });
        cursor += INCREMENT;
      }
    }
    return result;
  }

  private getEarliestBookableDate(allowSuddenBooking: boolean): dayjs.Dayjs {
    const now = dayjs();
    if (allowSuddenBooking) return now.startOf("day");

    const daysToAdd = now.hour() >= 17 ? 2 : 1;
    return now.add(daysToAdd, "day").startOf("day");
  }

  private travelMin(
    from: { lat: number; lng: number } | null,
    to: { lat: number; lng: number } | null
  ): number {
    if (!from || !to) return 0;
    const km = calculateDistanceKm(from, to);
    const raw = km * 3;
    return Math.ceil(raw / 10) * 10;
  }

  private resolveDuration(service: IService, category: ICategory, itemCount: number): number {
    const base = service.estimatedDuration;
    const duration = category.pricingMode === PRICING_MODE.PER_UNIT ? base * itemCount : base;
    return duration + service.bufferTime;
  }

  private mapOccupied(
    occupied: ISlot[]
  ): { startTime: string; endTime: string; location: { lat: number; lng: number } }[] {
    return occupied.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      location: {
        lat: s.location.coordinates[1],
        lng: s.location.coordinates[0],
      },
    }));
  }
}
