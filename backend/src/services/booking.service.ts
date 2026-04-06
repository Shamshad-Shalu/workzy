import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import {
  AUTH,
  BOOKING,
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BOOKING_STATUS_MESSAGES,
  BookingStatus,
  CATEGORY,
  HTTPSTATUS,
  PricingMode,
  Role,
  ROLE,
  SERVICE,
  SERVICE_TYPE,
  SLOT,
  SLOT_STATUS,
  STRIPE_ACCOUNT_STATUS,
  WORKER,
} from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IBookingService } from "@/core/interfaces/services/IBookingService";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { CompleteBookingDTO, CreatebookingDTO, ExtraChargeDTO } from "@/dtos/requests/booking.dto";
import { BookingResponseDTO, PaginatedBookingsDTO } from "@/dtos/responses/booking.dto";
import {
  BookingContext,
  BookingListParams,
  IBooking,
  IEvidence,
  IExtraCharge,
} from "@/types/booking";
import { BulkDiscountType } from "@/types/service";
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
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }> {
    const {
      workerId,
      serviceId,
      date,
      slotId,
      startTime,
      address,
      duration,
      endTime,
      itemCount = 1,
      userNote,
    } = data;

    const slot = await this._slotRepository.findById(slotId);
    if (!slot) {
      throw new CustomError(SLOT.NOT_AVAILABLE);
    }
    const { category, workerStripeId, service, isRemote, platformFeePercent, rate, travelCost } =
      await this.getBookingContext(
        workerId,
        serviceId,
        address?.location.coordinates[1],
        address?.location.coordinates[0]
      );

    const subtotal = rate * itemCount;
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

      date,
      startTime,
      endTime,
      duration,

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
      address: isRemote ? null : address,
      userNote,
    });
    console.log("booking::", booking);
    const url = await this._paymentService.createBookingPaymentCheckout({
      bookingId: booking._id.toString(),
      serviceName: category.name,
      slotId,
      amount: booking.total,
      userId,
      platformFee,
      workerStripeId,
    });
    return { url };
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
    lat?: number,
    lng?: number
  ): Promise<BookingContext> {
    const [service, worker] = await Promise.all([
      this._serviceRepository.findById(serviceId),
      this._workerRepository.findById(workerId),
    ]);
    if (!service) {
      throw new CustomError(SERVICE.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    if (!worker || worker.status !== "verified") {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const [category, user] = await Promise.all([
      this._categoryRepository.findById(service.categoryId),
      this._userRepository.findById(worker.userId),
    ]);
    if (!category) {
      throw new CustomError(CATEGORY.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    if (!user || user.isBlocked) {
      throw new CustomError(WORKER.NOT_AVAILABLE, HTTPSTATUS.BAD_REQUEST);
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
    const isRemote = category.serviceType === SERVICE_TYPE.REMOTE;

    let distanceKm = 0;
    let travelCost = 0;

    if (!isRemote && lat !== undefined && lng !== undefined) {
      distanceKm = calculateDistanceKm(
        { lat: worker.location.coordinates[1], lng: worker.location.coordinates[0] },
        { lat, lng }
      );
      travelCost = Math.min(
        Math.round(distanceKm * (travelRatePerKM ?? 0)),
        service.maxTravelCost ?? Infinity
      );
    }
    return {
      worker,
      user,
      service,
      category,
      isRemote,
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

  async getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsDTO> {
    const bookings = await this._bookingRepository.getUserBookings(userId, query);
    return PaginatedBookingsDTO.fromResult(bookings, this._s3Service);
  }

  async getWorkerBookings(
    workerId: string,
    query: BookingListParams
  ): Promise<PaginatedBookingsDTO> {
    const bookings = await this._bookingRepository.getWorkerBookings(workerId, query);
    console.log("booking::", bookings);
    return PaginatedBookingsDTO.fromResult(bookings, this._s3Service);
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
  }

  async acceptBooking(bookingId: string, workerId: string): Promise<void> {
    const [booking, _worker] = await Promise.all([
      this.getBookingOrThrow(bookingId),
      getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND),
    ]);
    this.assertWorkerOwnership(booking, workerId);
    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new CustomError(BOOKING.CANNOT_ACCEPT(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.paymentStatus !== BOOKING_PAYMENT_STATUS.HELD) {
      throw new CustomError(BOOKING.PAYMENT_NOT_CONFIRMED, HTTPSTATUS.BAD_REQUEST);
    }
    await this._bookingRepository.update(bookingId, {
      status: BOOKING_STATUS.CONFIRMED,
      $push: {
        statusHistory: this.createStatusHistoryEntry(
          BOOKING_STATUS.CONFIRMED,
          ROLE.USER,
          BOOKING_STATUS_MESSAGES.CONFIRMED
        ),
      },
    });
  }

  async rejectBooking(data: {
    bookingId: string;
    workerId: string;
    reason: string;
  }): Promise<void> {
    const { bookingId, workerId, reason } = data;

    const [booking] = await Promise.all([
      this.getBookingOrThrow(bookingId),
      getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND),
    ]);
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
  }

  async startJob(bookingId: string, workerId: string): Promise<void> {
    const [booking] = await Promise.all([
      this.getBookingOrThrow(bookingId),
      getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND),
    ]);
    this.assertWorkerOwnership(booking, workerId);
    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new CustomError(BOOKING.CANNOT_START(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    await this._bookingRepository.update(bookingId, {
      status: BOOKING_STATUS.IN_PROGRESS,
      $push: {
        statusHistory: this.createStatusHistoryEntry(
          BOOKING_STATUS.IN_PROGRESS,
          ROLE.WORKER,
          BOOKING_STATUS_MESSAGES.IN_PROGRESS
        ),
      },
    });
  }

  async completeJob(bookingId: string, workerId: string, data: CompleteBookingDTO): Promise<void> {
    const { evidence, note } = data;
    const [booking] = await Promise.all([
      this.getBookingOrThrow(bookingId),
      getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND),
    ]);
    this.assertWorkerOwnership(booking, workerId);
    if (booking.status !== BOOKING_STATUS.IN_PROGRESS) {
      throw new CustomError(BOOKING.CANNOT_COMPLETE(booking.status), HTTPSTATUS.BAD_REQUEST);
    }
    const bookingEvidence: IEvidence = {
      after: evidence.after,
      before: evidence.before,
      uploadedAt: new Date(),
    };
    await Promise.all([
      this._bookingRepository.update(bookingId, {
        status: BOOKING_STATUS.COMPLETED,
        evidence: bookingEvidence,
        adminNote: note,
        completedAt: new Date(),
        $push: {
          statusHistory: this.createStatusHistoryEntry(
            BOOKING_STATUS.COMPLETED,
            ROLE.WORKER,
            BOOKING_STATUS_MESSAGES.COMPLETED
          ),
        },
      }),
      this._slotRepository.findOneAndDelete({
        bookingId: new Types.ObjectId(bookingId),
        reservedBy: new Types.ObjectId(booking.userId),
        status: SLOT_STATUS.BOOKED,
      }),
    ]);
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
  }

  async payExtraCharge(bookingId: string, userId: string): Promise<{ url: string }> {
    const booking = await this.getBookingOrThrow(bookingId);
    if (booking.userId.toString() !== userId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    if (booking.status !== BOOKING_STATUS.COMPLETED) {
      throw new CustomError(
        "Extra charge can only be paid on completed bookings",
        HTTPSTATUS.BAD_REQUEST
      );
    }
    if (!booking.extraCharge || booking.extraCharge.status !== "pending") {
      throw new CustomError(
        "No pending extra charge found on this booking",
        HTTPSTATUS.BAD_REQUEST
      );
    }
    const url = await this._paymentService.createExtraChargeCheckout({
      userId,
      booking,
      amount: booking.extraCharge.amount,
    });
    return { url };
  }

  async rejectExtraCharge(bookingId: string, userId: string): Promise<void> {
    const booking = await this.getBookingOrThrow(bookingId);
    if (booking.userId.toString() !== userId) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    if (!booking.extraCharge || booking.extraCharge.status !== "pending") {
      throw new CustomError("No pending extra charge to reject", HTTPSTATUS.BAD_REQUEST);
    }
    await this._bookingRepository.update(bookingId, {
      "extraCharge.status": "rejected",
      "extraCharge.respondedAt": new Date(),
    });
  }

  async requestExtraCharge(
    bookingId: string,
    workerId: string,
    data: ExtraChargeDTO
  ): Promise<void> {
    const { amount, reason, evidenceUrl } = data;
    const [booking] = await Promise.all([
      this.getBookingOrThrow(bookingId),
      getEntityOrThrow(this._workerRepository, workerId, WORKER.NOT_FOUND),
    ]);
    this.assertWorkerOwnership(booking, workerId);
    const allowedStatuses: BookingStatus[] = [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.COMPLETED];
    if (!allowedStatuses.includes(booking.status)) {
      throw new CustomError(BOOKING.EXTRA_CHARGE_INVALID_STATUS, HTTPSTATUS.BAD_REQUEST);
    }
    if (booking.extraCharge) {
      throw new CustomError(BOOKING.EXTRA_CHARGE_ALREADY_EXISTS, HTTPSTATUS.CONFLICT);
    }
    const extraCharge: IExtraCharge = {
      amount,
      reason,
      status: "pending",
      evidenceUrl,
      requestedAt: new Date(),
    };
    await this._bookingRepository.update(bookingId, { extraCharge });
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

  async getBookingDetails(bookingId: string): Promise<BookingResponseDTO> {
    const booking = await this._bookingRepository.getBookingDetailById(bookingId);
    if (!booking) {
      throw new CustomError(BOOKING.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    return BookingResponseDTO.fromEntity(booking, this._s3Service);
  }
}
