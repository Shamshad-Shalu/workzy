import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS } from "@/constants";
import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { TYPES } from "@/di/types";
import { AdminCancelDTO, AdminNoteDTO } from "@/dtos/requests/admin/booking.dto";
import { ApiResponse } from "@/utils/apiResponse";

@injectable()
export class AdminBookingController implements IAdminBookingController {
  constructor(
    @inject(TYPES.AdminBookingService) private _adminBookingService: IAdminBookingService
  ) {}

  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as AdminCancelDTO;
    await this._adminBookingService.adminCancelBooking(bookingId, data);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(null, "Booking cancelled by admin."));
  });

  addNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as AdminNoteDTO;
    await this._adminBookingService.addAdminNote(bookingId, data);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(null, "Admin note updated."));
  });
}
