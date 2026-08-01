import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { QUOTE_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IQuoteRepository } from "@/core/interfaces/repositories/IQuoteRepository";
import { WorkerQuoteStatsDto } from "@/dtos/responses/quote.dto";
import QuoteModel from "@/models/quote.model";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IQuote } from "@/types/quote/quote.entity";
import { QuoteListItem } from "@/types/quote/quote.projection";
import { QuoteListQuery } from "@/types/quote/quote.query";

@injectable()
export class QuoteRepository extends BaseRepository<IQuote> implements IQuoteRepository {
  constructor() {
    super(QuoteModel);
  }
  async listQuotes(query: QuoteListQuery): Promise<CursorPaginatedResult<QuoteListItem>> {
    const { limit, search, cursor, status, userId, workerId } = query;

    const filter: FilterQuery<IQuote> = {};
    const andConditions: FilterQuery<IQuote>[] = [];

    if (status !== "all") {
      filter.status = status;
    }
    if (userId) filter.userId = new Types.ObjectId(userId);
    if (workerId) filter.workerId = new Types.ObjectId(workerId);

    if (search) {
      filter.searchText = { $regex: search.trim(), $options: "i" };
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { createdAt: { $lt: new Date(cursor.createdAt) } },
          {
            createdAt: new Date(cursor.createdAt),
            _id: { $lt: new Types.ObjectId(cursor._id) },
          },
        ],
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }
    const docs = await this.model
      .find(filter)
      .select("dates bookingId serviceId totalPrice message status createdAt")
      .populate("workerId", "profileImage displayName")
      .populate("userId", "profileImage name")
      .populate("categoryId", "iconUrl name")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<QuoteListItem[]>();

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

  async getWorkerQuoteStats(workerId: string): Promise<WorkerQuoteStatsDto> {
    const [stats] = await this.model.aggregate([
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
        },
      },
      {
        $group: {
          _id: null,
          all: { $sum: 1 },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", QUOTE_STATUS.PENDING] }, 1, 0],
            },
          },
          accepted: {
            $sum: {
              $cond: [{ $eq: ["$status", QUOTE_STATUS.ACCEPTED] }, 1, 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", QUOTE_STATUS.REJECTED] }, 1, 0],
            },
          },
          expired: {
            $sum: {
              $cond: [{ $eq: ["$status", QUOTE_STATUS.EXPIRED] }, 1, 0],
            },
          },

          totalEarned: {
            $sum: {
              $cond: [{ $eq: ["$status", QUOTE_STATUS.ACCEPTED] }, "$totalPrice", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarned: 1,
          counts: {
            all: "$all",
            pending: "$pending",
            accepted: "$accepted",
            rejected: "$rejected",
            expired: "$expired",
          },
          acceptRate: {
            $cond: [
              { $eq: ["$all", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$accepted", "$all"] }, 100] }, 1] },
            ],
          },
        },
      },
    ]);

    return (
      stats ?? {
        totalEarned: 0,
        counts: {
          all: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          expired: 0,
        },
        acceptRate: 0,
      }
    );
  }
}
