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
      status,
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

    if (status === "hidden") {
      query.isHidden = true;
    } else if (status === "visible") {
      query.isHidden = false;
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
      .populate("userId", "profileImage")
      .populate("workerId", "profileImage")
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

  // async getRatingsSummary(workerId: string): Promise<RatingsSummaryDTO> {
  //   const [summary, recent] = await Promise.all([
  //     this.model.aggregate([
  //       { $match: { workerId:new Types.ObjectId(workerId), isHidden: false } },
  //       {
  //         $group: {
  //           _id: null,
  //           averageRating: { $avg: "$rating" },
  //           totalReviews: { $sum: 1 },
  //           r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
  //           r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
  //           r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
  //           r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
  //           r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
  //         },
  //       },
  //     ]),

  //     this.model.aggregate([
  //       { $match: { workerId:new Types.ObjectId(workerId), isHidden: false } },
  //       { $sort: { createdAt: -1 } },
  //       { $limit: 3 },
  //       {
  //         $lookup: {
  //           from: "users",
  //           localField: "userId",
  //           foreignField: "_id",
  //           as: "user",
  //           pipeline: [{ $project: { name: 1, profileImage: 1 } }],
  //         },
  //       },
  //       { $unwind: "$user" },
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "categoryId",
  //           foreignField: "_id",
  //           as: "category",
  //           pipeline: [{ $project: { name: 1 } }],
  //         },
  //       },
  //       { $unwind: { path: "$category", preserveNullAndEmpty: true } },
  //       {
  //         $project: {
  //           _id: 0,
  //           id: { $toString: "$_id" },
  //           customerName: "$user.name",
  //           customerImage: "$user.profileImage",
  //           rating: 1,
  //           reviewText: 1,
  //           serviceName: "$category.name",
  //           createdAt: 1,
  //         },
  //       },
  //     ]),
  //   ]);

  //   const s = summary[0] ?? {};
  //   return {
  //     averageRating: parseFloat((s.averageRating ?? 0).toFixed(1)),
  //     totalReviews: s.totalReviews ?? 0,
  //     breakdown: { 1: s.r1 ?? 0, 2: s.r2 ?? 0, 3: s.r3 ?? 0, 4: s.r4 ?? 0, 5: s.r5 ?? 0 },
  //     recent,
  //   };
  // }
}
