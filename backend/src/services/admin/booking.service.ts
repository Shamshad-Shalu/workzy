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
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import {
  AdminCancelDTO,
  AdminNoteDTO,
  AdminRefundDTO,
  ResolveDisputeDTO,
} from "@/dtos/requests/admin/booking.dto";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class AdminBookingService implements IAdminBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async addAdminNote(bookingId: string, data: AdminNoteDTO): Promise<void> {
    const booking = await this._bookingRepository.update(bookingId, {
      adminNote: data.note,
    });
    if (booking) {
      throw new CustomError("Error while updating booking", HTTPSTATUS.BAD_REQUEST);
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
      this._bookingRepository.update(bookingId, {
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
  async adminRefund(bookingId: string, data: AdminRefundDTO): Promise<void> {
    const booking = await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);

    if (booking.paymentStatus !== BOOKING_PAYMENT_STATUS.HELD) {
      throw new CustomError(
        `Cannot refund — payment is not in held state. Current: ${booking.paymentStatus}`,
        HTTPSTATUS.BAD_REQUEST
      );
    }

    await this._paymentService.refundBookingPayment(bookingId);
    await this._bookingRepository.update(bookingId, {
      paymentStatus: BOOKING_PAYMENT_STATUS.REFUNDED,
      adminNote: data.reason,
      $push: {
        statusHistory: this.createStatusHistoryEntry(
          booking.status,
          ROLE.ADMIN,
          data.reason ?? "Manual refund by admin"
        ),
      },
    });
  }

  async resolveDispute(bookingId: string, data: ResolveDisputeDTO): Promise<{ message: string }> {
    const { resolution, adminNote } = data;
    const booking = await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);

    if (booking.status !== BOOKING_STATUS.DISPUTED) {
      throw new CustomError(
        `Cannot resolve a booking that is not disputed. Current status: ${booking.status}`,
        HTTPSTATUS.BAD_REQUEST
      );
    }

    if (resolution === "approve") {
      if (booking.paymentStatus !== BOOKING_PAYMENT_STATUS.HELD) {
        throw new CustomError(BOOKING.PAYMENT_NOT_HELD, HTTPSTATUS.BAD_REQUEST);
      }
      await this._paymentService.releaseBookingPayment(booking);
      await this._bookingRepository.update(bookingId, {
        status: BOOKING_STATUS.APPROVED,
        paymentStatus: BOOKING_PAYMENT_STATUS.RELEASED,
        adminNote,
        completedAt: new Date(),
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.APPROVED,
            ROLE.ADMIN,
            adminNote
          ),
        },
      });
    } else {
      if (booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD) {
        await this._paymentService.refundBookingPayment(bookingId);
      }
      await this._bookingRepository.update(bookingId, {
        status: BOOKING_STATUS.CANCELLED,
        paymentStatus: BOOKING_PAYMENT_STATUS.REFUNDED,
        adminNote,
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.CANCELLED,
            ROLE.ADMIN,
            adminNote
          ),
        },
      });
    }
    return {
      message: `Dispute resolved — booking ${resolution === "approve" ? "approved" : "refunded"}`,
    };
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
