import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { BookingPaymentStatus, HTTPSTATUS } from "@/constants";
import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { TYPES } from "@/di/types";
import { AdminBookingListParams, ListingStatus } from "@/types/booking";

@injectable()
export class AdminBookingController implements IAdminBookingController {
  constructor(
    @inject(TYPES.AdminBookingService) private _adminBookingService: IAdminBookingService
  ) {}
  getAllBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = this.parseAdminQuery(req);
    const result = await this._adminBookingService.getAllBookings(query);
    res.status(HTTPSTATUS.OK).json(result);
  });

  getUserBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  getWorkerBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {});

  private parseAdminQuery(req: Request): AdminBookingListParams {
    const status = (req.query.status as string) || "all";
    const paymentStatus = (req.query.paymentStatus as string) || "all";
    const search = (req.query.search as string) || "";
    const parsedLimit = parseInt(req.query.limit as string, 10);
    const limit = Number.isNaN(parsedLimit) ? 10 : Math.min(Math.max(parsedLimit, 1), 100);
    const parsedPage = parseInt(req.query.page as string, 10);
    const page = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);

    return {
      status: status as ListingStatus,
      paymentStatus: paymentStatus as BookingPaymentStatus | "all",
      limit,
      page,
      search,
    };
  }
}
