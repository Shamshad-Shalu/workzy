import dayjs from "dayjs";
import { injectable } from "inversify";
import { FilterQuery, FlattenMaps, Types } from "mongoose";
import { PipelineStage } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ILeaveRepository } from "@/core/interfaces/repositories/ILeaveRepository";
import LeaveModel from "@/models/leave.model";
import { GetLeavesQueryDTO, ILeave, LeaveStatsResponseDTO } from "@/types/leave";
import { getMonthRange } from "@/utils/time.utils";

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

  async getLeaveStats(workerId: string): Promise<LeaveStatsResponseDTO> {
    const now = dayjs().toDate();
    const { start, end } = getMonthRange();

    const pipeline: PipelineStage[] = [
      { $match: { workerId: new Types.ObjectId(workerId) } },
      {
        $facet: {
          total: [{ $count: "count" }],
          upcoming: [{ $match: { startDate: { $gt: now } } }, { $count: "count" }],
          past: [{ $match: { endDate: { $lt: now } } }, { $count: "count" }],
          thisMonth: [
            { $match: { startDate: { $lte: end }, endDate: { $gte: start } } },
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
          upcoming: { $ifNull: [{ $arrayElemAt: ["$upcoming.count", 0] }, 0] },
          past: { $ifNull: [{ $arrayElemAt: ["$past.count", 0] }, 0] },
          thisMonth: { $ifNull: [{ $arrayElemAt: ["$thisMonth.count", 0] }, 0] },
        },
      },
    ];

    const [result] = await this.model.aggregate(pipeline).exec();
    return result;
  }

  async getPaginatedLeaves(
    filters: GetLeavesQueryDTO
  ): Promise<{ data: FlattenMaps<ILeave>[]; nextCursor: string | null }> {
    const { filter, cursor, limit, workerId } = filters;

    const now = dayjs().toDate();
    const { start, end } = getMonthRange();
    const filterQuery: FilterQuery<ILeave> = {
      workerId: new Types.ObjectId(workerId),
      ...(cursor && Types.ObjectId.isValid(cursor) && { _id: { $lt: new Types.ObjectId(cursor) } }),
      ...(filter === "upcoming" && {
        startDate: { $gt: now },
      }),
      ...(filter === "past" && {
        endDate: { $lt: now },
      }),
      ...(filter === "this-month" && {
        startDate: { $lte: end },
        endDate: { $gte: start },
      }),
    };

    const docs = await this.model
      .find(filterQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();

    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();
    const nextCursor = hasMore ? docs[docs.length - 1]._id.toString() : null;

    return {
      data: docs,
      nextCursor,
    };
  }
}
