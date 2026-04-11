import { CreateQuoteSlotsDTO, CreateSlotDTO } from "@/dtos/requests/slot.dto";
import { AvailableSlot, GetAvailableDatesDTO, GetSlotsDTO } from "@/types/slot";

export interface ISlotService {
  getAvailableDates(dto: GetAvailableDatesDTO): Promise<Record<string, boolean>>;
  getAvailableSlots(dto: GetSlotsDTO): Promise<AvailableSlot[]>;
  reserveSlot(
    userId: string,
    data: CreateSlotDTO
  ): Promise<{ slotId: string; reservedUntil: Date }>;
  reserveQuoteSlots(
    workerId: string,
    data: CreateQuoteSlotsDTO
  ): Promise<{ slotIds: string[]; reservedUntil: Date }>;
  releaseSlot(slotId: string, userId: string): Promise<boolean>;
  cleanupExpired(): Promise<number>;
}
