import { injectable } from "inversify";
import { Types } from "mongoose";

import { SLOT_STATUS } from "@/constants/booking";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { RepositoryOptions } from "@/core/types/repository";
import SlotModel from "@/models/slot.model";
import { ISlot, SlotOption } from "@/types/slot";

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

  async updatePaymentSlots(
    slotIds: string[],
    bookingId: Types.ObjectId,
    options?: RepositoryOptions
  ): Promise<void> {
    await this.model.updateMany(
      { _id: { $in: slotIds.map((id) => new Types.ObjectId(id)) } },
      {
        $set: {
          status: SLOT_STATUS.BOOKED,
          bookingId,
        },
      },
      { session: options?.session }
    );
  }

  async cleanupExpiredReservations(): Promise<number> {
    const result = await this.model.deleteMany({
      status: SLOT_STATUS.RESERVED,
      reservedUntil: { $lt: new Date() },
    });
    return result.deletedCount;
  }

  findManyByIds(ids: string[]): Promise<ISlot[]> {
    return this.model.find({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.model.deleteMany({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
  }
  async hasBookedSlotsInRange(workerId: string, from: Date, to: Date): Promise<boolean> {
    const count = await this.model.countDocuments({
      workerId: new Types.ObjectId(workerId),
      date: { $gte: from, $lte: to },
      status: { $in: [SLOT_STATUS.BOOKED, SLOT_STATUS.RESERVED] },
    });
    return count > 0;
  }

  async getRescheduleSlotOptions(bookingId: string): Promise<SlotOption[]> {
    return await this.model
      .find({
        bookingId: new Types.ObjectId(bookingId),
        status: SLOT_STATUS.BOOKED,
      })
      .select("_id date startTime endTime isFullDay duration")
      .lean()
      .exec();
  }
}
