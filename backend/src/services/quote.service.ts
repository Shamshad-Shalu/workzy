import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { BOOKING, HTTPSTATUS, QUOTE_STATUS } from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IQuoteRepository } from "@/core/interfaces/repositories/IQuoteRepository";
import { IQuoteService } from "@/core/interfaces/services/IQuoteService";
import { ISlotService } from "@/core/interfaces/services/ISlotService";
import { TYPES } from "@/di/types";
import { CreateQuoteDto } from "@/dtos/requests/quote.dto";
import { QuoteResponseDto } from "@/dtos/responses/quote.dto";
import CustomError from "@/utils/customError";

@injectable()
export class QuoteService implements IQuoteService {
  constructor(
    @inject(TYPES.SlotService) private _slotService: ISlotService,
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.QuoteRepository) private _quoteRepository: IQuoteRepository
  ) {}

  async createQuote(workerId: string, data: CreateQuoteDto): Promise<QuoteResponseDto> {
    const { bookingId, dates: selectedDates, totalPrice, message } = data;
    const booking = await this._bookingRepository.findOne({
      _id: new Types.ObjectId(bookingId),
      workerId: new Types.ObjectId(workerId),
    });
    if (!booking) {
      throw new CustomError(BOOKING.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const { serviceId, userId, address } = booking;
    const [lng, lat] = address.location.coordinates;

    const { slotIds, reservedUntil, dates } = await this._slotService.reserveQuoteSlots(workerId, {
      serviceId: serviceId.toString(),
      bookingId: bookingId,
      dates: selectedDates.map((d) => new Date(d)),
      lat,
      lng,
    });
    const quote = await this._quoteRepository.create({
      workerId: new Types.ObjectId(workerId),
      userId: new Types.ObjectId(userId.toString()),
      serviceId,
      bookingId: new Types.ObjectId(bookingId),
      slotIds: slotIds.map((id) => new Types.ObjectId(id)),
      dates,
      totalPrice,
      message,
      status: QUOTE_STATUS.PENDING,
      expiresAt: reservedUntil,
    });

    console.log({ quote, slotIds, dates, reservedUntil });

    return quote;
  }
}
