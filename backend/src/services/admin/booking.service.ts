import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import {
  BOOKING,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BookingStatus,
  HTTPSTATUS,
  Role,
  ROLE,
  SLOT_STATUS,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { TYPES } from "@/di/types";
import { AdminCancelDTO, AdminNoteDTO } from "@/dtos/requests/admin/booking.dto";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class AdminBookingService implements IAdminBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository
  ) {}

  async addAdminNote(bookingId: string, data: AdminNoteDTO): Promise<void> {
    const booking = await this._bookingRepository.findByIdAndUpdate(bookingId, {
      adminNote: data.note,
    });
    if (!booking) {
      throw new CustomError(BOOKING.UPDATE_FAILED, HTTPSTATUS.BAD_REQUEST);
    }
  }

  async adminCancelBooking(bookingId: string, data: AdminCancelDTO): Promise<void> {
    const { reason } = data;
    const booking = await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);

    const nonCancellable: BookingStatus[] = [
      BOOKING_STATUS.APPROVED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.REJECTED,
    ];
    if (nonCancellable.includes(booking.status)) {
      throw new CustomError(BOOKING.CANNOT_CANCEL(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD) {
      await this._paymentService.refundBookingPayment(bookingId);
    }

    await Promise.all([
      this._bookingRepository.findByIdAndUpdate(bookingId, {
        status: BOOKING_STATUS.CANCELLED,
        paymentStatus:
          booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD
            ? BOOKING_PAYMENT_STATUS.REFUNDED
            : booking.paymentStatus,
        adminNote: reason,
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.CANCELLED,
            ROLE.ADMIN,
            reason
          ),
        },
      }),
      this._slotRepository.findOneAndDelete({
        bookingId: new Types.ObjectId(bookingId),
        status: SLOT_STATUS.BOOKED,
      }),
    ]);
  }
  private createStatusHistoryEntry(status: BookingStatus, changedBy: Role, reason?: string) {
    return {
      status,
      changedBy,
      reason: reason ?? null,
      changedAt: new Date(),
    };
  }
}
