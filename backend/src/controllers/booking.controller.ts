import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS } from "@/constants";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { TYPES } from "@/di/types";
import { CancelBookingDTO, CreatebookingDTO } from "@/dtos/requests/booking.dto";
import { BookingListParams, ListingStatus } from "@/types/booking";
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
  getUserBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);

    const query = this.parseQuery(req);
    console.log({ query });
    const result = await this._bookingService.getUserBookings(userId, query);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getBookingById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;

    console.log("bookingId", bookingId);
    const result = await this._bookingService.getBookingDetails(bookingId);
    res.status(HTTPSTATUS.OK).json({ data: result });
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    const { reason } = req.body as CancelBookingDTO;
    if (!userId) throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    console.log("bookingId", bookingId, "reason:", reason);
    await this._bookingService.cancelBooking(bookingId, userId, reason);

    res.status(HTTPSTATUS.OK).json({ message: "Booking cancelled successfully" });
  });

  private parseQuery(req: Request): BookingListParams {
    const status = (req.query.status as string) || "all";
    const parsedLimit = parseInt(req.query.limit as string, 10);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.min(Math.max(parsedLimit, 1), 10);
    const rawCursor = (req.query.cursor as string | undefined) ?? null;
    const sortOrder = (req.query.sort as string) === "asc" ? "asc" : "desc";
    const cursor = rawCursor
      ? JSON.parse(Buffer.from(rawCursor, "base64url").toString("utf8"))
      : null;
    const sort = status === "upcoming" ? "asc" : sortOrder;

    return {
      status: status as ListingStatus,
      limit,
      cursor,
      sort,
    };
  }
  // startBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  // completeBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
