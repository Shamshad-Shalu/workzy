import { FilterQuery, Types } from "mongoose";

import { DISPUTE_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IDisputeRepository } from "@/core/interfaces/repositories/IDisputeRepository";
import { DisputeStatsResponse } from "@/dtos/responses/dispute.dto";
import Dispute from "@/models/dispute.model";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IDispute } from "@/types/dispute/dispute.entity";
import { DisputeDetails, DisputeListItem } from "@/types/dispute/dispute.projection";
import { DisputeListQuery, DisputeStatsQuery } from "@/types/dispute/dispute.query";

export class DisputeRepository extends BaseRepository<IDispute> implements IDisputeRepository {
  constructor() {
    super(Dispute);
  }
  async findByBookingId(bookingId: string): Promise<DisputeDetails | null> {
    return await this.model
      .findOne({ bookingId: new Types.ObjectId(bookingId) })
      .select(
        "userId workerId bookingId disputeId reason description evidence status createdAt raisedBy resolvedAt adminNote refundedAmount resolution "
      )
      .populate("workerId", "profileImage displayName phone")
      .populate("userId", "profileImage name phone")
      .populate("bookingId", "snapshot")
      .lean<DisputeDetails>();
  }

  async getAllDisputes(input: DisputeListQuery): Promise<CursorPaginatedResult<DisputeListItem>> {
    const { limit, cursor, reason, status, search, userId, workerId } = input;
    const query: FilterQuery<IDispute> = {};
    const andConditions: FilterQuery<IDispute>[] = [];
    if (search) {
      query.$or = [
        { searchText: { $regex: search, $options: "i" } },
        { disputeId: { $regex: search, $options: "i" } },
      ];
    }
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }
    if (workerId) {
      query.workerId = new Types.ObjectId(workerId);
    }
    if (reason && reason !== "all") {
      query.reason = reason;
    }
    if (status && status !== "all") {
      query.status = status;
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { createdAt: { $lt: cursor.createdAt } },
          {
            createdAt: cursor.createdAt,
            _id: { $lt: new Types.ObjectId(cursor._id) },
          },
        ],
      });
    }
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }
    const docs = await this.model
      .find(query)
      .select("disputeId bookingId userId workerId reason status createdAt raisedBy")
      .populate("workerId", "profileImage displayName")
      .populate("userId", "profileImage name")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<DisputeListItem[]>();

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      docs.pop();
      const lastItem = docs[docs.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: lastItem.createdAt.toISOString(),
          _id: lastItem._id.toString(),
        })
      ).toString("base64url");
    }
    return {
      data: docs,
      nextCursor: nextCursor,
    };
  }

  async getDisputeStats(input?: DisputeStatsQuery): Promise<DisputeStatsResponse> {
    const { userId, workerId } = input ?? {};

    const matchStage: FilterQuery<IDispute> = {};
    if (userId) {
      matchStage.userId = new Types.ObjectId(userId);
    }
    if (workerId) {
      matchStage.workerId = new Types.ObjectId(workerId);
    }
    const [stats] = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", DISPUTE_STATUS.PENDING] }, 1, 0] } },
          under_review: {
            $sum: { $cond: [{ $eq: ["$status", DISPUTE_STATUS.UNDER_REVIEW] }, 1, 0] },
          },
          resolved: { $sum: { $cond: [{ $eq: ["$status", DISPUTE_STATUS.RESOLVED] }, 1, 0] } },
          dismissed: { $sum: { $cond: [{ $eq: ["$status", DISPUTE_STATUS.DISMISSED] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          pending: 1,
          under_review: 1,
          resolved: 1,
          dismissed: 1,
        },
      },
    ]);
    return (
      stats ?? {
        total: 0,
        pending: 0,
        under_review: 0,
        resolved: 0,
        dismissed: 0,
      }
    );
  }
}
