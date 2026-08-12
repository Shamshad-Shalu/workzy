import { Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { RepositoryOptions } from "@/core/types/repository";
import { ISlot, SlotOption } from "@/types/slot";

export interface ISlotRepository extends BaseRepository<ISlot> {
  cleanupExpiredReservations(): Promise<number>;
  getOccupiedSlots(workerId: string, start: Date, end: Date): Promise<ISlot[]>;
  findManyByIds(ids: string[]): Promise<ISlot[]>;
  deleteManyByIds(ids: string[]): Promise<void>;
  updatePaymentSlots(
    slotIds: string[],
    bookingId: Types.ObjectId,
    options?: RepositoryOptions
  ): Promise<void>;
  hasBookedSlotsInRange(workerId: string, from: Date, to: Date): Promise<boolean>;
  getRescheduleSlotOptions(bookingId: string): Promise<SlotOption[]>;
}
