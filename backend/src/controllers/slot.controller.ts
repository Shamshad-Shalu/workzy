import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, SLOT } from "@/constants";
import { ISlotController } from "@/core/interfaces/controllers/ISlotController";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { CreateSlotDTO } from "@/dtos/requests/slot.dto";
import CustomError from "@/utils/customError";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotService) private _slotService: ISlotService) {}

  getAvailableDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.query.workerId as string;
    const serviceId = req.query.serviceId as string;
    const lat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
    const lng = req.query.lng !== undefined ? Number(req.query.lng) : undefined;
    const itemCount = req.query.itemCount !== undefined ? Number(req.query.itemCount) : 1;

    if (!workerId || !serviceId) {
      throw new CustomError(SLOT.FIELDS_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    }
    const dates = await this._slotService.getAvailableDates({
      workerId,
      serviceId,
      lat,
      lng,
      itemCount,
    });
    res.status(HTTPSTATUS.OK).json({ dates });
  });

  getAvailableSlots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.query.workerId as string;
    const serviceId = req.query.serviceId as string;
    const date = req.query.date as string;
    const lat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
    const lng = req.query.lng !== undefined ? Number(req.query.lng) : undefined;
    const itemCount = req.query.itemCount !== undefined ? Number(req.query.itemCount) : 1;

    if (!workerId || !serviceId || !date) {
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
    res.status(HTTPSTATUS.OK).json({ slots });
  });

  reserveSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as CreateSlotDTO;
    const { slotId, reservedUntil } = await this._slotService.reserveSlot(userId, data);
    res.status(HTTPSTATUS.CREATED).json({ message: SLOT.CREATED, slotId, reservedUntil });
  });

  releaseSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const { slotId } = req.params;
    await this._slotService.releaseSlot(slotId, userId);
    res.status(HTTPSTATUS.OK).json({ message: SLOT.RELEASED });
  });
}
