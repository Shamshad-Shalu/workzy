import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS } from "@/constants";
import { IAdminBookingController } from "@/core/interfaces/controllers/admin/IAdminBookingController";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { TYPES } from "@/di/types";
import {
  AdminCancelDTO,
  AdminNoteDTO,
  AdminRefundDTO,
  ResolveDisputeDTO,
} from "@/dtos/requests/admin/booking.dto";

@injectable()
export class AdminBookingController implements IAdminBookingController {
  constructor(
    @inject(TYPES.AdminBookingService) private _adminBookingService: IAdminBookingService
  ) {}

  resolveDispute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as ResolveDisputeDTO;
    const { message } = await this._adminBookingService.resolveDispute(bookingId, data);
    res.status(HTTPSTATUS.OK).json({ message });
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as AdminCancelDTO;
    await this._adminBookingService.adminCancelBooking(bookingId, data);
    res.status(HTTPSTATUS.OK).json({ message: "Booking cancelled by admin." });
  });

  addNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as AdminNoteDTO;
    await this._adminBookingService.addAdminNote(bookingId, data);
    res.status(HTTPSTATUS.OK).json({ message: "Admin note updated." });
  });

  refund = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const data = req.body as AdminRefundDTO;
    await this._adminBookingService.adminRefund(bookingId, data);
    res.status(HTTPSTATUS.OK).json({ message: "Refund processed successfully." });
  });
}
