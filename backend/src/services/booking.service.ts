import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import {
  CATEGORY,
  HTTPSTATUS,
  PricingMode,
  SERVICE,
  SERVICE_TYPE,
  SLOT,
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
import { TYPES } from "@/di/types";
import { CreatebookingDTO } from "@/dtos/requests/booking.dto";
import { BookingContext } from "@/types/booking";
import { BulkDiscountType } from "@/types/service";
import CustomError from "@/utils/customError";
import { generateTxnCode } from "@/utils/generateTxnCode";
import { calculateDistanceKm } from "@/utils/geo";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.ServiceRepository) private _serviceRepository: IServiceRepository,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService
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
}
