import dayjs from "dayjs";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import logger from "@/config/logger";
import {
  AUTH,
  BOOKING,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BOOKING_STATUS_MESSAGES,
  BookingStatus,
  CATEGORY,
  HTTPSTATUS,
  NOTIFICATION_TEMPLATES,
  PRICING_MODE,
  PricingMode,
  Role,
  ROLE,
  SERVICE,
  SERVICE_TYPE,
  SLOT,
  SLOT_STATUS,
  STRIPE_ACCOUNT_STATUS,
  USER,
  WORKER,
  WORKER_STATUS,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { IEmailService } from "@/core/interfaces/services/IEmailService";
import { INotificationService } from "@/core/interfaces/services/INotificationService";
import { IOTPService } from "@/core/interfaces/services/IOTPService";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { CompleteBookingDTO, CreatebookingDTO, ExtraChargeDTO } from "@/dtos/requests/booking.dto";
import { BookingListItemDTO, BookingResponseDTO } from "@/dtos/responses/booking.dto";
import { BookingContext, IBooking, IEvidence, IExtraCharge } from "@/types/booking/booking.entity";
import { BookingListQuery } from "@/types/booking/booking.query";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { BulkDiscountType } from "@/types/service/service.entity";
import CustomError from "@/utils/customError";
import { generateTxnCode } from "@/utils/generateTxnCode";
import { calculateDistanceKm } from "@/utils/geo";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
    @inject(TYPES.OTPService) private _otpService: IOTPService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.S3Service) private _s3Service: IS3Service,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  async getBookings(input: BookingListQuery): Promise<CursorPaginatedResult<BookingListItemDTO>> {
    const { data, nextCursor } = await this._bookingRepository.getBookings(input);
    return {
      data: await BookingListItemDTO.fromEntities(data, this._s3Service),
      nextCursor,
    };
  }

  async getBookingDetails(bookingId: string): Promise<BookingResponseDTO> {
    const booking = await this._bookingRepository.getBookingDetailById(bookingId);
    if (!booking) {
      throw new CustomError(BOOKING.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    return await BookingResponseDTO.fromEntity(booking, this._s3Service);
  }

  async createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }> {
    const { workerId, serviceId, slotId, address, itemCount = 1, userNote } = data;

    const [slot, user] = await Promise.all([
      this._slotRepository.findById(slotId),
      this._userRepository.findById(userId),
    ]);
    if (!slot) {
      throw new CustomError(SLOT.NOT_AVAILABLE, HTTPSTATUS.BAD_REQUEST);
    }
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const { date, startTime, endTime, reservedBy, duration } = slot;

    if (reservedBy?.toString() !== userId) {
      throw new CustomError(SLOT.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const { category, worker, workerStripeId, service, platformFeePercent, rate, travelCost } =
      await this.getBookingContext(
        workerId,
        serviceId,
        address.location.coordinates[1],
        address.location.coordinates[0]
      );
    const subtotal = rate * itemCount;

    const finalEndTime = dayjs(`2000-01-01 ${endTime}`)
      .subtract(service.bufferTime, "minute")
      .format("HH:mm");

    const discountPercent =
      this.getBestDiscount(service?.bulkDiscounts ?? null, itemCount)?.percent ?? 0;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const chargeableAmount = subtotal - discountAmount;
    const platformFee = Math.floor((chargeableAmount * platformFeePercent) / 100);

    const booking = await this._bookingRepository.create({
      bookingId: generateTxnCode("BKG"),
      userId: new Types.ObjectId(userId),
      workerId: new Types.ObjectId(workerId),
      serviceId: new Types.ObjectId(serviceId),
      categoryId: new Types.ObjectId(category._id),
      dates: [{ date, startTime, endTime: finalEndTime }],
      duration: duration - service.bufferTime,

      rate,
      itemCount,
      subtotal: rate * itemCount,
      discountPercent,
      discountAmount,
      chargeableAmount,
      travelCost,
      platformFeePercent,
      platformFee,
      total: chargeableAmount + travelCost,
      address: address,
      userNote,
      snapshot: {
        user: {
          name: user.name,
          phone: user.phone,
        },
        worker,
        category: {
          name: category.name,
          pricingMode: category.pricingMode ?? PRICING_MODE.PER_UNIT,
          serviceType: category.serviceType ?? SERVICE_TYPE.SMALL_TASK,
        },
      },
    });

    const url = await this._paymentService.createBookingPaymentCheckout({
      bookingId: booking._id.toString(),
      workerAmount: booking.total - booking.platformFee,
      workerId: booking.workerId.toString(),
      serviceName: category.name,
      slotId,
      amount: booking.total,
      userId,
      platformFee,
      workerStripeId,
      userName: user.name,
      workerName: booking.snapshot.worker.name,
    });
    return { url };
  }

  async cancelBooking(bookingId: string, userId: string, reason: string): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);

    if (booking.userId.toString() !== userId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    const cancellableStatuses = [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED];
    if (!cancellableStatuses.includes(booking.status as (typeof cancellableStatuses)[number])) {
      throw new CustomError(BOOKING.CANNOT_CANCEL(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD) {
      await this._paymentService.refundBookingPayment(bookingId);
    }
    const paymentStatus =
      booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD
        ? BOOKING_PAYMENT_STATUS.REFUNDED
        : booking.paymentStatus;

    await this._bookingRepository.update(bookingId, {
      $set: {
        status: BOOKING_STATUS.CANCELLED,
        paymentStatus,
      },
      $push: {
        statusHistory: this.createStatusHistoryEntry(BOOKING_STATUS.CANCELLED, ROLE.USER, reason),
      },
    });
    await this._slotRepository.findOneAndDelete({
      bookingId: new Types.ObjectId(bookingId),
      reservedBy: new Types.ObjectId(userId),
      status: SLOT_STATUS.BOOKED,
    });
    void this._notificationService.createNotification(
      booking.workerId.toString(),
      NOTIFICATION_TEMPLATES.BOOKING_CANCELLED(booking.bookingId)
    );
  }

  async acceptBooking(bookingId: string, workerId: string): Promise<void> {
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        workerId: new Types.ObjectId(workerId),
        status: BOOKING_STATUS.PENDING,
        paymentStatus: BOOKING_PAYMENT_STATUS.HELD,
      },
      {
        status: BOOKING_STATUS.CONFIRMED,
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.CONFIRMED,
            ROLE.WORKER,
            BOOKING_STATUS_MESSAGES.CONFIRMED
          ),
        },
      }
    );
    if (!booking) {
      throw new CustomError(BOOKING.CANNOT_ACCEPT, HTTPSTATUS.BAD_REQUEST);
    }
    await this._workerRepository.findOneAndUpdate({ _id: workerId }, { $inc: { jobsAccepted: 1 } });
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.BOOKING_ACCEPTED(booking.bookingId, booking.snapshot.worker.name)
    );
  }

  async rejectBooking(data: {
    bookingId: string;
    workerId: string;
    reason: string;
  }): Promise<void> {
    const { bookingId, workerId, reason } = data;
    const booking = await this.getBookingOrThrow(bookingId);
    this.assertWorkerOwnership(booking, workerId);
    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new CustomError(BOOKING.CANNOT_REJECT(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD) {
      await this._paymentService.refundBookingPayment(bookingId);
    }
    const paymentStatus =
      booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD
        ? BOOKING_PAYMENT_STATUS.REFUNDED
        : booking.paymentStatus;

    await this._bookingRepository.update(bookingId, {
      status: BOOKING_STATUS.REJECTED,
      paymentStatus,
      $push: {
        statusHistory: this.createStatusHistoryEntry(BOOKING_STATUS.REJECTED, ROLE.WORKER, reason),
      },
    });
    await this._slotRepository.findOneAndDelete({
      bookingId: new Types.ObjectId(bookingId),
      reservedBy: new Types.ObjectId(booking.userId),
      status: SLOT_STATUS.BOOKED,
    });

    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.BOOKING_REJECTED(
        booking.bookingId,
        booking.snapshot.worker.name,
        reason
      )
    );
  }

  async markEnRoute(bookingId: string, workerId: string): Promise<void> {
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        workerId: new Types.ObjectId(workerId),
        status: BOOKING_STATUS.CONFIRMED,
      },
      {
        status: BOOKING_STATUS.EN_ROUTE,
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.EN_ROUTE,
            ROLE.WORKER,
            BOOKING_STATUS_MESSAGES.EN_ROUTE
          ),
        },
      }
    );
    if (!booking) {
      throw new CustomError(BOOKING.CANNOT_EN_ROUTE, HTTPSTATUS.BAD_REQUEST);
    }
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.WORKER_EN_ROUTE(booking.snapshot.worker.name, booking.bookingId)
    );
  }

  async markReached(bookingId: string, workerId: string): Promise<void> {
    const otp = this._otpService.generateOTP();
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        workerId: new Types.ObjectId(workerId),
        status: BOOKING_STATUS.EN_ROUTE,
      },
      {
        status: BOOKING_STATUS.REACHED,
        otp,
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.REACHED,
            ROLE.WORKER,
            BOOKING_STATUS_MESSAGES.REACHED
          ),
        },
      }
    );
    if (!booking) {
      throw new CustomError(BOOKING.CANNOT_REACH, HTTPSTATUS.BAD_REQUEST);
    }
    const user = await this._userRepository.findById(booking.userId);
    if (!user) {
      throw new CustomError(USER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    logger.info(`Generated OTP ${otp} for booking ${bookingId}`);
    await this._emailService.sendEmail(user.email, otp);
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.WORKER_REACHED(booking.snapshot.worker.name, booking.bookingId)
    );
  }

  async startJob(bookingId: string, workerId: string, otp: string): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);
    this.assertWorkerOwnership(booking, workerId);
    if (booking.status !== BOOKING_STATUS.REACHED) {
      throw new CustomError(BOOKING.CANNOT_START(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (!booking.otp || booking.otp !== otp) {
      throw new CustomError(BOOKING.INVALID_OTP, HTTPSTATUS.BAD_REQUEST);
    }
    await this._bookingRepository.update(bookingId, {
      status: BOOKING_STATUS.IN_PROGRESS,
      $unset: { otp: "" },
      $push: {
        statusHistory: this.createStatusHistoryEntry(
          BOOKING_STATUS.IN_PROGRESS,
          ROLE.WORKER,
          BOOKING_STATUS_MESSAGES.IN_PROGRESS
        ),
      },
    });
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.JOB_STARTED(booking.bookingId)
    );
  }

  async completeJob(bookingId: string, workerId: string, data: CompleteBookingDTO): Promise<void> {
    const { evidence, note } = data;
    const bookingEvidence: IEvidence = {
      after: evidence.after,
      before: evidence.before,
      uploadedAt: new Date(),
    };
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        workerId: new Types.ObjectId(workerId),
        status: BOOKING_STATUS.IN_PROGRESS,
      },
      {
        status: BOOKING_STATUS.COMPLETED,
        evidence: bookingEvidence,
        workerNote: note,
        completedAt: new Date(),
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.COMPLETED,
            ROLE.WORKER,
            BOOKING_STATUS_MESSAGES.COMPLETED
          ),
        },
      }
    );
    if (!booking) {
      throw new CustomError(BOOKING.CANNOT_COMPLETE, HTTPSTATUS.BAD_REQUEST);
    }
    await Promise.all([
      this._slotRepository.findOneAndDelete({
        bookingId: new Types.ObjectId(bookingId),
        reservedBy: new Types.ObjectId(booking.userId),
        status: SLOT_STATUS.BOOKED,
      }),
      this._workerRepository.findByIdAndUpdate(workerId, { $inc: { jobsCompleted: 1 } }),
    ]);
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.JOB_COMPLETED(booking.bookingId, booking.snapshot.worker.name)
    );
  }

  async approveBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);
    if (booking.userId.toString() !== userId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new CustomError(BOOKING.CANNOT_APPROVE(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus !== BOOKING_PAYMENT_STATUS.HELD) {
      throw new CustomError(BOOKING.PAYMENT_NOT_HELD, HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.extraCharge?.status === "pending") {
      throw new CustomError(BOOKING.EXTRA_CHARGE_PENDING, HTTPSTATUS.BAD_REQUEST);
    }
    await this._paymentService.releaseBookingPayment(booking);
    await this._bookingRepository.update(bookingId, {
      status: BOOKING_STATUS.APPROVED,
      paymentStatus: BOOKING_PAYMENT_STATUS.RELEASED,
      completedAt: new Date(),
      $push: {
        statusHistory: this.createStatusHistoryEntry(
          BOOKING_STATUS.APPROVED,
          ROLE.USER,
          BOOKING_STATUS_MESSAGES.APPROVED
        ),
      },
    });
    void this._notificationService.createNotification(
      booking.workerId.toString(),
      NOTIFICATION_TEMPLATES.JOB_APPROVED(booking.bookingId, booking.snapshot.user.name)
    );
  }

  async payExtraCharge(bookingId: string, userId: string): Promise<{ url: string }> {
    const booking = await this.getBookingOrThrow(bookingId);
    if (booking.userId.toString() !== userId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new CustomError(BOOKING.EXTRA_CHARGE_INVALID_STATUS, HTTPSTATUS.BAD_REQUEST);
    }
    if (!booking.extraCharge || booking.extraCharge.status !== "pending") {
      throw new CustomError(BOOKING.EXTRA_CHARGE_NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const url = await this._paymentService.createExtraChargeCheckout({
      userId,
      booking,
      amount: booking.extraCharge.amount,
    });
    return { url };
  }

  async rejectExtraCharge(bookingId: string, userId: string): Promise<void> {
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        userId: new Types.ObjectId(userId),
        "extraCharge.status": "pending",
      },
      {
        "extraCharge.status": "rejected",
        "extraCharge.respondedAt": new Date(),
      }
    );
    if (!booking) {
      throw new CustomError(BOOKING.EXTRA_CHARGE_NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    void this._notificationService.createNotification(
      booking.workerId.toString(),
      NOTIFICATION_TEMPLATES.EXTRA_CHARGE_REJECTED(
        booking.bookingId,
        booking.extraCharge?.amount ?? 0
      )
    );
  }

  async requestExtraCharge(
    bookingId: string,
    workerId: string,
    data: ExtraChargeDTO
  ): Promise<void> {
    const { amount, reason, evidenceUrl } = data;
    const extraCharge: IExtraCharge = {
      amount,
      reason,
      status: "pending",
      evidenceUrl,
      requestedAt: new Date(),
    };
    const booking = await this._bookingRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(bookingId),
        workerId: new Types.ObjectId(workerId),
        status: { $in: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.COMPLETED] },
        $or: [
          { extraCharge: { $exists: false } },
          { "extraCharge.status": { $in: ["pending", "rejected"] } },
        ],
      },
      { extraCharge }
    );
    if (!booking) {
      throw new CustomError(BOOKING.EXTRA_CHARGE_INVALID_STATUS, HTTPSTATUS.BAD_REQUEST);
    }
    void this._notificationService.createNotification(
      booking.userId.toString(),
      NOTIFICATION_TEMPLATES.EXTRA_CHARGE_REQUESTED(amount, booking.bookingId)
    );
  }

  async expireBooking(): Promise<void> {
    const bookings = await this._bookingRepository.getExpiredBookings();
    if (!bookings.length) {
      return;
    }
    const results = await Promise.allSettled(
      bookings.map((booking) => this.processBookingExpiry(booking))
    );
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info(`Booking expiry job done — ${succeeded} expired successfully, ${failed} failed.`);
  }

  private async processBookingExpiry(booking: IBooking): Promise<void> {
    try {
      if (booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD) {
        await this._paymentService.refundBookingPayment(booking._id.toString());
      }
      await Promise.all([
        this._bookingRepository.update(booking._id.toString(), {
          status: BOOKING_STATUS.EXPIRED,
          paymentStatus:
            booking.paymentStatus === BOOKING_PAYMENT_STATUS.HELD
              ? BOOKING_PAYMENT_STATUS.REFUNDED
              : booking.paymentStatus,
          $push: {
            statusHistory: this.createStatusHistoryEntry(
              BOOKING_STATUS.EXPIRED,
              ROLE.SYSTEM,
              BOOKING_STATUS_MESSAGES.EXPIRED
            ),
          },
        }),
        this._slotRepository.findOneAndDelete({
          bookingId: new Types.ObjectId(booking._id.toString()),
          reservedBy: new Types.ObjectId(booking.userId),
          status: SLOT_STATUS.BOOKED,
        }),
        this._workerRepository.findOneAndUpdate(
          { _id: booking.workerId },
          { $inc: { noResponses: 1 } }
        ),
      ]);
      void this._notificationService.createNotification(
        booking.userId.toString(),
        NOTIFICATION_TEMPLATES.BOOKING_EXPIRED(booking.bookingId)
      );
    } catch (error) {
      logger.error(`Failed to expire booking ${booking._id}:`, error);
      throw error;
    }
  }

  private assertWorkerOwnership(booking: IBooking, workerId: string): void {
    if (booking.workerId.toString() !== workerId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
  }

  private createStatusHistoryEntry(status: BookingStatus, changedBy: Role, reason?: string) {
    return {
      status,
      changedBy,
      reason: reason ?? null,
      changedAt: new Date(),
    };
  }

  private async getBookingOrThrow(bookingId: string): Promise<IBooking> {
    return await getEntityOrThrow(this._bookingRepository, bookingId, BOOKING.NOT_FOUND);
  }

  private getBestDiscount(discounts: BulkDiscountType[] | null, count: number) {
    if (!discounts || !discounts?.length) {
      return null;
    }
    const eligible = discounts.filter((d) => count >= d.count);
    if (!eligible.length) {
      return null;
    }
    return eligible.reduce((a, b) => (a.percent > b.percent ? a : b));
  }

  private async getBookingContext(
    workerId: string,
    serviceId: string,
    lat: number,
    lng: number
  ): Promise<BookingContext> {
    const [service, worker] = await Promise.all([
      this._serviceRepository.findById(serviceId),
      this._workerRepository.findById(workerId),
    ]);
    if (!service) {
      throw new CustomError(SERVICE.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    if (!worker || worker.status !== WORKER_STATUS.VERIFIED) {
      throw new CustomError(WORKER.NOT_AVAILABLE, HTTPSTATUS.BAD_REQUEST);
    }
    const category = await this._categoryRepository.findById(service.categoryId);
    if (!category) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const workerStripeId = worker.stripeAccountId;
    if (!workerStripeId || worker.stripeAccountStatus !== STRIPE_ACCOUNT_STATUS.ACTIVE) {
      throw new CustomError(WORKER.STRIPE_NOT_ACTIVE, HTTPSTATUS.BAD_REQUEST);
    }

    const rate = service.rate ?? category.baseRate;
    const estimatedDuration = service.estimatedDuration ?? category.estimatedDuration ?? 60;
    const bufferTime = service.bufferTime ?? category.bufferTime ?? 15;
    const platformFeePercent = category.platformFee ?? 0;
    const travelRatePerKM = category.travelRatePerKM ?? 0;
    const pricingMode = category.pricingMode as PricingMode;

    const distanceKm = calculateDistanceKm(
      { lat: worker.location.coordinates[1], lng: worker.location.coordinates[0] },
      { lat, lng }
    );
    const travelCost = Math.min(
      Math.round(distanceKm * (travelRatePerKM ?? 0)),
      service.maxTravelCost ?? Infinity
    );

    return {
      worker: {
        name: worker.displayName,
        phone: worker.phone,
      },
      service,
      category,
      pricingMode,
      rate,
      workerStripeId,
      estimatedDuration,
      bufferTime,
      platformFeePercent,
      travelRatePerKM,
      distanceKm,
      travelCost,
    };
  }
}
