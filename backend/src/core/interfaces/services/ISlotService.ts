import { Role } from "@/constants";
import { CreateQuoteSlotsDTO, CreateSlotDTO, RescheduleSlotDto } from "@/dtos/requests/slot.dto";
import { SlotOptionResponseDto } from "@/dtos/responses/slot.dto";
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
  getRescheduleDates(
    bookingId: string
  ): Promise<{ dates: Record<string, boolean>; isFullDay: boolean }>;
  getRescheduleSlots(bookingId: string, date: Date): Promise<AvailableSlot[]>;
  reserveRescheduleSlot({
    bookingId,
    data,
    initiatorId,
  }: {
    bookingId: string;
    initiatorId: string;
    data: RescheduleSlotDto;
  }): Promise<{ slotId: string; reservedUntil: Date }>;
  getRescheduleSlotOptions(bookingId: string): Promise<SlotOptionResponseDto[]>;
  releaseRescheduleSlot(slotId: string, initiatorId: string, role: Role): Promise<void>;
}
