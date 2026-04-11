import { injectable } from "inversify";
import { FlattenMaps, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ILeaveRepository } from "@/core/interfaces/repositories/ILeaveRepository";
import LeaveModel from "@/models/leave.model";
import { ILeave } from "@/types/leave";

@injectable()
export class LeaveRepository extends BaseRepository<ILeave> implements ILeaveRepository {
  constructor() {
    super(LeaveModel);
  }

  async getActiveLeaves(workerId: string, from: Date, to: Date): Promise<FlattenMaps<ILeave>[]> {
    return this.model
      .find({
        workerId: new Types.ObjectId(workerId),
        startDate: { $lte: to },
        endDate: { $gte: from },
      })
      .lean()
      .exec();
  }
}
