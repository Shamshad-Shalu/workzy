import { injectable } from "inversify";

import { SLOT_STATUS } from "@/constants/booking";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import SlotModel from "@/models/slot.model";
import { ISlot } from "@/types/slot";

@injectable()
export class SlotRepository extends BaseRepository<ISlot> implements ISlotRepository {
  constructor() {
    super(SlotModel);
  }
  getOccupiedSlots(workerId: string, start: Date, end: Date): Promise<ISlot[]> {
    return this.model.find({
      workerId,
      date: { $gte: start, $lte: end },
      status: { $in: [SLOT_STATUS.BOOKED, SLOT_STATUS.RESERVED] },
    });
  }

  async cleanupExpiredReservations(): Promise<number> {
    const result = await this.model.deleteMany({
      status: SLOT_STATUS.RESERVED,
      reservedUntil: { $lt: new Date() },
    });
    return result.deletedCount;
  }
}
