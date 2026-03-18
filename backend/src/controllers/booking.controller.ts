import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS } from "@/constants";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { TYPES } from "@/di/types";
import { CreatebookingDTO } from "@/dtos/requests/booking.dto";
import CustomError from "@/utils/customError";

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(TYPES.BookingService) private _bookingService: IBookingService) {}
  createBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    const data = req.body as CreatebookingDTO;
    const { url } = await this._bookingService.createBooking(userId, data);
    res.status(HTTPSTATUS.OK).json({ url });
  });
  // getBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  // getBookingById = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  // cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  // startBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  // completeBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
