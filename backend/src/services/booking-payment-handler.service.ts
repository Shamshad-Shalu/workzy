import { inject, injectable } from "inversify";
import { Types, UpdateQuery } from "mongoose";

import logger from "@/config/logger";
import {
  BOOKING,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BOOKING_STATUS_MESSAGES,
  NOTIFICATION_TEMPLATES,
  QUOTE_STATUS,
  ROLE,
  SLOT_STATUS,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IQuoteRepository } from "@/core/interfaces/repositories/IQuoteRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IBookingPaymentHandler } from "@/core/interfaces/services/IBookingPaymentHandler";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { INotificationService } from "@/core/interfaces/services/INotificationService";
import { TYPES } from "@/di/types";
import { IBooking } from "@/types/booking/booking.entity";
import { IWorker } from "@/types/worker/worker.entity";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class BookingPaymentHandlerService implements IBookingPaymentHandler {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.QuoteRepository) private _quoteRepository: IQuoteRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.MessageService) private _messageService: IMessageService
  ) {}

  private async getBookingOrThrow(bookingId: string): Promise<IBooking> {
    return await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);
  }

  private async sendBookingEvent(booking: IBooking, content: string): Promise<void> {
    try {
      await this._messageService.saveBookingEvent({
        userId: booking.userId.toString(),
        workerId: booking.workerId.toString(),
        bookingId: booking._id.toString(),
        content,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to send BookingEvent";
      logger.error(`Failed to save booking event message -${booking.bookingId} - ${msg}`);
    }
  }

  async confirmBookingAfterPayment(
    bookingId: string,
    slotId: string,
    workerId: string
  ): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);

    let slotUpdate: Promise<unknown>;
    let bookingUpdateData: UpdateQuery<IBooking>;
    let workerUpdateData: UpdateQuery<IWorker>;
    let notifyAction: () => void;
    let chatMessage = `Booking ${booking.bookingId} has been created and is awaiting worker confirmation`;

    if (booking.quoteId) {
      const quote = await this._quoteRepository.findById(booking.quoteId.toString());
      const slotIds = quote?.slotIds?.map((id) => id.toString()) ?? [];
      slotUpdate = Promise.all([
        this._slotRepository.updatePaymentSlots(slotIds, new Types.ObjectId(bookingId)),
        this._quoteRepository.findByIdAndUpdate(booking.quoteId, { status: QUOTE_STATUS.ACCEPTED }),
      ]);

      bookingUpdateData = {
        paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
        status: BOOKING_STATUS.CONFIRMED,
        statusHistory: [
          {
            status: BOOKING_STATUS.CONFIRMED,
            reason: "Quote accepted and paid by customer",
            changedBy: ROLE.USER,
            changedAt: new Date(),
          },
        ],
      };
      workerUpdateData = { $inc: { "jobStats.offered": 1, "jobStats.accepted": 1 } };
      chatMessage = `Booking ${booking.bookingId} has been created`;
      notifyAction = () => {
        void this._notificationService.createNotification(
          workerId,
          NOTIFICATION_TEMPLATES.QUOTE_ACCEPTED(booking.bookingId, booking.total)
        );
      };
    } else {
      slotUpdate = this._slotRepository.findByIdAndUpdate(slotId, {
        status: SLOT_STATUS.BOOKED,
        bookingId: new Types.ObjectId(bookingId),
      });

      bookingUpdateData = {
        paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
        statusHistory: [
          {
            status: BOOKING_STATUS.PENDING,
            reason: BOOKING_STATUS_MESSAGES.PENDING,
            changedBy: ROLE.USER,
            changedAt: new Date(),
          },
        ],
      };
      workerUpdateData = { $inc: { "jobStats.offered": 1 } };

      notifyAction = () => {
        void this._notificationService.createNotification(
          workerId,
          NOTIFICATION_TEMPLATES.NEW_BOOKING_REQUEST(booking.snapshot.category.name ?? "a service")
        );
      };
    }
    await Promise.all([
      slotUpdate,
      this._bookingRepository.findByIdAndUpdate(bookingId, bookingUpdateData),
      this._workerRepository.findByIdAndUpdate(workerId, workerUpdateData),
      this.sendBookingEvent(booking, chatMessage),
    ]);

    notifyAction();
  }

  async handleExtraChargeAfterPayment(bookingId: string): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);
    await this._bookingRepository.findByIdAndUpdate(bookingId, {
      "extraCharge.status": "approved",
      "extraCharge.respondedAt": new Date(),
      $inc: { total: booking.extraCharge?.amount },
    });

    void this._notificationService.createNotification(
      booking.workerId.toString(),
      NOTIFICATION_TEMPLATES.EXTRA_CHARGE_PAID(booking.bookingId, booking?.extraCharge?.amount ?? 0)
    );
  }
}
