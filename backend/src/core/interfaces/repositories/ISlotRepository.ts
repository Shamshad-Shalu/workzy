import { BaseRepository } from "@/core/abstracts/base.repository";
import { ISlot } from "@/types/slot";

export interface ISlotRepository extends BaseRepository<ISlot> {
  cleanupExpiredReservations(): Promise<number>;
  getOccupiedSlots(workerId: string, start: Date, end: Date): Promise<ISlot[]>;
  findManyByIds(ids: string[]): Promise<ISlot[]>;
  deleteManyByIds(ids: string[]): Promise<void>;
}
