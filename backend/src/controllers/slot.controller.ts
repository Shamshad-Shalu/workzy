import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, Role, ROLE, SLOT } from "@/constants";
import { ISlotController } from "@/core/interfaces/controllers/ISlotController";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { CreateQuoteSlotsDTO, CreateSlotDTO, RescheduleSlotDto } from "@/dtos/requests/slot.dto";
import { GetQuoteAvailableDatesDTO } from "@/types/slot";
import { ApiResponse } from "@/utils/apiResponse";
import CustomError from "@/utils/customError";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotService) private _slotService: ISlotService) {}

  getAvailableDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = this.parseQuery(req);
    const workerId = req.query.workerId as string;
    const serviceId = req.query.serviceId as string;
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!workerId || !serviceId || !lat || !lng) {
      throw new CustomError(SLOT.FIELDS_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const dates = await this._slotService.getAvailableDates({
      ...query,
      workerId,
      serviceId,
      lat,
      lng,
    });
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ dates }));
  });

  getAvailableDatesForQuotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { serviceId } = req.params;
    const query = this.parseQuery(req);
    const dates = await this._slotService.getAvailableDatesForQuotes({
      ...query,
      serviceId,
      workerId,
    });
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ dates }));
  });

  private parseQuery(req: Request): Omit<GetQuoteAvailableDatesDTO, "workerId" | "serviceId"> {
    const itemCount = req.query.itemCount !== undefined ? Number(req.query.itemCount) : 1;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    return {
      itemCount,
      startDate,
      endDate,
    };
  }

  getAvailableSlots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.query.workerId as string;
    const serviceId = req.query.serviceId as string;
    const date = req.query.date as string;
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const itemCount = req.query.itemCount !== undefined ? Number(req.query.itemCount) : 1;

    if (!workerId || !serviceId || !date || !lat || !lng) {
      throw new CustomError(SLOT.FIELDS_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new CustomError(SLOT.INVALID_DATE, HTTPSTATUS.BAD_REQUEST);
    }
    const slots = await this._slotService.getAvailableSlots({
      workerId,
      date: parsedDate,
      serviceId,
      lat,
      lng,
      itemCount,
    });
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ slots }));
  });

  reserveSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const data = req.body as CreateSlotDTO;
    const { slotId, reservedUntil } = await this._slotService.reserveSlot(userId, data);
    res.status(HTTPSTATUS.CREATED).json(new ApiResponse({ slotId, reservedUntil }, SLOT.CREATED));
  });

  releaseSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { slotId } = req.params;
    await this._slotService.releaseSlot(slotId, userId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(null, SLOT.RELEASED));
  });

  reserveQuoteSlots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const data = req.body as CreateQuoteSlotsDTO;

    const { slotIds, reservedUntil } = await this._slotService.reserveQuoteSlots(workerId, data);
    res.status(HTTPSTATUS.CREATED).json(new ApiResponse({ slotIds, reservedUntil }, SLOT.CREATED));
  });

  getRescheduleDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { dates, isFullDay } = await this._slotService.getRescheduleDates(bookingId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ dates, isFullDay }));
  });

  getRescheduleSlots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const date = req.query.date as string;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new CustomError(SLOT.INVALID_DATE, HTTPSTATUS.BAD_REQUEST);
    }
    const slots = await this._slotService.getRescheduleSlots(bookingId, parsedDate);
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ slots }));
  });

  getRescheduleSlotOptions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const slots = await this._slotService.getRescheduleSlotOptions(bookingId);
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ slots }));
  });

  reserveRescheduleSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as RescheduleSlotDto;
    const initiatorId =
      data.requestedBy === ROLE.WORKER ? this.requireWorkerId(req) : this.requireUserId(req);
    const { slotId, reservedUntil } = await this._slotService.reserveRescheduleSlot({
      bookingId,
      initiatorId,
      data,
    });
    res.status(HTTPSTATUS.CREATED).json(new ApiResponse({ slotId, reservedUntil }, SLOT.CREATED));
  });

  releaseRescheduleSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookingId = req.query.bookingId as string;
    const role = req.query.role as Role;
    if (!bookingId && !role) {
      throw new CustomError(SLOT.RELEASE_ERROR);
    }
    const { slotId } = req.params;
    const initiatorId = role === ROLE.WORKER ? this.requireWorkerId(req) : this.requireUserId(req);
    await this._slotService.releaseRescheduleSlot(slotId, initiatorId, role);

    res.status(HTTPSTATUS.OK).json(new ApiResponse(null, SLOT.RELEASED));
  });

  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.id;
  }
  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }
}
