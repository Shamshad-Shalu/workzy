import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IReviewRepository } from "@/core/interfaces/repositories/IReviewRepository";
import ReviewModel from "@/models/review.model";
import { IReview, IReviewPopulated, ReviewListQuery } from "@/types/review";

@injectable()
export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(ReviewModel);
  }
  async getAllReviews(
    filters: ReviewListQuery
  ): Promise<{ reviews: IReviewPopulated[]; nextCursor: string | null }> {
    const {
      search,
      limit,
      cursor,
      fromDate,
      isHidden,
      maxRating,
      minRating,
      rating,
      serviceId,
      sortBy = "createdAt",
      sortOrder = "desc",
      toDate,
      userId,
      workerId,
    } = filters;

    const query: FilterQuery<IReview> = {};
    const andConditions: FilterQuery<IReview>[] = [];
    if (userId) query.userId = new Types.ObjectId(userId);
    if (workerId) query.workerId = new Types.ObjectId(workerId);
    if (serviceId) query.serviceId = new Types.ObjectId(serviceId);

    if (isHidden === false) {
      query.isHidden = isHidden;
    }

    if (rating) {
      query.rating = rating;
    } else if (minRating || maxRating) {
      query.rating = {
        ...(minRating && { $gte: minRating }),
        ...(maxRating && { $lte: maxRating }),
      };
    }
    if (fromDate || toDate) {
      query.createdAt = {
        ...(fromDate && { $gte: fromDate }),
        ...(toDate && { $lte: toDate }),
      };
    }
    if (search) {
      andConditions.push({
        $or: [
          { reviewText: { $regex: search, $options: "i" } },
          { "snapshot.user.name": { $regex: search, $options: "i" } },
          { "snapshot.worker.name": { $regex: search, $options: "i" } },
          { "snapshot.service.name": { $regex: search, $options: "i" } },
        ],
      });
    }
    if (cursor) {
      if (sortBy === "rating") {
        andConditions.push({
          $or: [
            { rating: { [sortOrder === "desc" ? "$lt" : "$gt"]: cursor.rating } },
            {
              rating: cursor.rating,
              _id: { $lt: new Types.ObjectId(cursor._id) },
            },
          ],
        });
      } else {
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
    }
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }
    const sortQuery: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
      _id: -1,
    };

    const docs = await this.model
      .find(query)
      .populate("bookingId", "snapshot")
      .sort(sortQuery)
      .limit(limit + 1)
      .lean<IReviewPopulated[]>();

    let nextCursor: string | null = null;

    if (docs.length > limit) {
      docs.pop();
      const last = docs[docs.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: last.createdAt.toISOString(),
          rating: last.rating,
          _id: last._id.toString(),
        })
      ).toString("base64url");
    }
    return { reviews: docs, nextCursor };
  }
}
