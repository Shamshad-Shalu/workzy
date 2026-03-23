import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, BOOKING_STATUS_MESSAGES, HTTPSTATUS } from "@/constants";
import { IBookingController } from "@/core/interfaces/controllers/IBookingController";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { TYPES } from "@/di/types";
import {
  CancelBookingDTO,
  CompleteBookingDTO,
  CreatebookingDTO,
  ExtraChargeDTO,
  RejectBookingDTO,
} from "@/dtos/requests/booking.dto";
import { BookingListParams, ListingStatus } from "@/types/booking";
import CustomError from "@/utils/customError";

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(TYPES.BookingService) private _bookingService: IBookingService) {}
  createBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const data = req.body as CreatebookingDTO;
    const { url } = await this._bookingService.createBooking(userId, data);
    res.status(HTTPSTATUS.OK).json({ url });
  });

  getUserBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const query = this.parseQuery(req);
    const result = await this._bookingService.getUserBookings(userId, query);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getWorkerBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const query = this.parseQuery(req);
    const result = await this._bookingService.getWorkerBookings(workerId, query);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getBookingById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;

    const result = await this._bookingService.getBookingDetails(bookingId);
    res.status(HTTPSTATUS.OK).json({ data: result });
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { bookingId } = req.params;
    const { reason } = req.body as CancelBookingDTO;
    await this._bookingService.cancelBooking(bookingId, userId, reason);

    res.status(HTTPSTATUS.OK).json({ message: BOOKING_STATUS_MESSAGES.CANCELLED });
  });

  acceptBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const workerId = this.requireWorkerId(req);
    await this._bookingService.acceptBooking(bookingId, workerId);
    res.status(HTTPSTATUS.OK).json({ message: BOOKING_STATUS_MESSAGES.CONFIRMED });
  });

  rejectBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { bookingId } = req.params;
    const { reason } = req.body as RejectBookingDTO;
    await this._bookingService.rejectBooking({ bookingId, reason, workerId });
    res.status(HTTPSTATUS.OK).json({ message: BOOKING_STATUS_MESSAGES.REJECTED });
  });

  startJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { bookingId } = req.params;

    await this._bookingService.startJob(bookingId, workerId);
    res.status(HTTPSTATUS.OK).json({ message: BOOKING_STATUS_MESSAGES.IN_PROGRESS });
  });

  approveBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { bookingId } = req.params;

    await this._bookingService.approveBooking(bookingId, userId);
    res.status(HTTPSTATUS.OK).json({ message: "Job approved and payment released" });
  });
  payExtraCharge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { bookingId } = req.params;

    const { url } = await this._bookingService.payExtraCharge(bookingId, userId);
    res.status(HTTPSTATUS.OK).json({ url });
  });
  rejectExtraCharge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.requireUserId(req);
    const { bookingId } = req.params;
    await this._bookingService.rejectExtraCharge(bookingId, userId);
    res.status(HTTPSTATUS.OK).json({ message: "Extra charge rejected" });
  });
  completeJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { bookingId } = req.params;
    const data = req.body as CompleteBookingDTO;

    await this._bookingService.completeJob(bookingId, workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: BOOKING_STATUS_MESSAGES.COMPLETED });
  });
  requestExtraCharge = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { bookingId } = req.params;

    const data = req.body as ExtraChargeDTO;
    await this._bookingService.requestExtraCharge(bookingId, workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: "Extra charge request sent to client" });
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

  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    return req.user.id;
  }

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
    return req.user.workerId;
  }
}
