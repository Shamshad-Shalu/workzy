import { injectable } from "inversify";
import { FilterQuery, PipelineStage, Types } from "mongoose";

import { ROLE, WORKER_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import User from "@/models/user.model";
import Worker from "@/models/worker.model";
import {
  IWorker,
  NearbyWorkerEntity,
  WorkerListingEntity,
  WorkerListingFiltersDist,
} from "@/types/worker";
import { getCurrentTime, getTodayKey } from "@/utils/time.utils";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
  constructor() {
    super(Worker);
  }

  async getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null> {
    const workers = await this.model
      .find(filter)
      .populate("userId", "name email phone isPremium isBlocked profileImage age")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return workers as unknown as IWorker[];
  }

  findNearbyWorkers(
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number
  ): Promise<NearbyWorkerEntity[]> {
    const maxDistance = radiusKm * 1000; // Convert km to meters

    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          key: "profile.location",
          distanceField: "distance",
          maxDistance: maxDistance,
          spherical: true,
          query: {
            role: ROLE.WORKER,
            isBlocked: false,
          },
        },
      },
      {
        $lookup: {
          from: "workers",
          localField: "_id",
          foreignField: "userId",
          as: "worker",
        },
      },
      {
        $unwind: "$worker",
      },
      {
        $match: { "worker.status": WORKER_STATUS.VERIFIED },
      },
      {
        $project: {
          _id: 1,
          profileImage: 1,
          distance: { $divide: ["$distance", 1000] },

          workerId: "$worker._id",
          displayName: "$worker.displayName",
          tagline: "$worker.tagline",
          experience: "$worker.experience",
        },
      },
      { $sort: { distance: 1 } },
      { $limit: limit },
    ];
    return User.aggregate<NearbyWorkerEntity>(pipeline).exec();
  }

  async listWorkers(
    serviceId: string,
    params: WorkerListingFiltersDist
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }> {
    const { lng, lat, limit, page, availableNow, maxPrice, minPrice, minRating, radiusKm } = params;

    const skip = (page - 1) * limit;
    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          key: "location",
          distanceField: "distance",
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: {
            status: WORKER_STATUS.VERIFIED,
            ...(minRating !== undefined && { averageRating: { $gte: minRating } }),
          },
        },
      },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 1] },
        },
      },
      {
        $lookup: {
          from: "services",
          let: { workerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$workerId", "$$workerId"] },
                    { $eq: ["$categoryId", new Types.ObjectId(serviceId)] },
                    { $eq: ["$isAvailable", true] },
                  ],
                },
              },
            },
          ],
          as: "services",
        },
      },
      { $match: { $expr: { $gt: [{ $size: "$services" }, 0] } } },
      { $unwind: "$services" },
      {
        $match: {
          $expr: {
            $gte: [{ $ifNull: ["$services.maxTravelRadius", 0] }, "$distanceKm"],
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { categoryId: "$services.categoryId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$categoryId"] },
                isAvailable: true,
              },
            },
          ],
          as: "category",
        },
      },
      { $match: { "category.0": { $exists: true } } },
      { $unwind: "$category" },
      {
        $match: {
          $expr: {
            $and: [
              {
                $gte: ["$services.rate", minPrice ?? { $divide: ["$category.baseRate", 2] }],
              },
              {
                $lte: ["$services.rate", maxPrice ?? { $multiply: ["$category.baseRate", 2] }],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.isBlocked": false } },
      ...(availableNow
        ? [
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $filter: {
                          input: { $ifNull: [`$availability.${getTodayKey()}`, []] },
                          as: "slot",
                          cond: {
                            $and: [
                              { $lte: ["$$slot.startTime", getCurrentTime()] },
                              { $gte: ["$$slot.endTime", getCurrentTime()] },
                            ],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ]
        : []),
      {
        $facet: {
          workersRaw: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                workerId: "$_id",
                userId: "$userId",
                displayName: "$displayName",
                tagline: "$tagline",
                about: "$about",
                coverImage: "$coverImage",
                isPremium: "$isPremium",
                skills: "$skills",
                reviewCount: "$reviewCount",
                worksCompleted: "$worksCompleted",
                profileImage: "$user.profileImage",
                experience: "$experience",
                averageRating: "$averageRating",
                serviceRate: "$services.rate",
                estimatedDuration: "$services.estimatedDuration",
                categoryName: "$category.name",
                pricingMode: "$category.pricingMode",
                distanceKm: "$distanceKm",
                bulkDiscounts: {
                  $cond: [
                    { $gt: [{ $size: { $ifNull: ["$services.bulkDiscounts", []] } }, 0] },
                    "$services.bulkDiscounts",
                    null,
                  ],
                },
                travelCost: {
                  $trunc: {
                    $min: [
                      { $multiply: ["$distanceKm", { $ifNull: ["$category.travelRatePerKM", 0] }] },
                      { $ifNull: ["$services.maxTravelCost", 999999] },
                    ],
                  },
                },
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const res = await this.model.aggregate(pipeline).exec();
    const workersRaw = res[0]?.workersRaw ?? [];
    const total = res[0]?.total?.[0]?.count ?? 0;
    return { workersRaw, total };
  }
}
