import { CreateQuoteSlotsDTO, CreateSlotDTO } from "@/dtos/requests/slot.dto";
import { IBookingSlot } from "@/types/booking/booking.entity";
import {
  AvailableSlot,
  GetAvailableDatesDTO,
  GetQuoteAvailableDatesDTO,
  GetSlotsDTO,
} from "@/types/slot";

export interface ISlotService {
  getAvailableDates(dto: GetAvailableDatesDTO): Promise<Record<string, boolean>>;
  getAvailableDatesForQuotes(dto: GetQuoteAvailableDatesDTO): Promise<Record<string, boolean>>;
  getAvailableSlots(dto: GetSlotsDTO): Promise<AvailableSlot[]>;
  reserveSlot(
    userId: string,
    data: CreateSlotDTO
  ): Promise<{ slotId: string; reservedUntil: Date }>;
  reserveQuoteSlots(
    workerId: string,
    data: CreateQuoteSlotsDTO
  ): Promise<{ slotIds: string[]; reservedUntil: Date; dates: IBookingSlot[] }>;
  releaseSlot(slotId: string, userId: string): Promise<boolean>;
  releaseQuoteSlots(slotIds: string[]): Promise<boolean>;
  cleanupExpired(): Promise<number>;
}
