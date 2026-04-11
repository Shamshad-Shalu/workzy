import { injectable } from "inversify";
import { FilterQuery, PipelineStage, Types } from "mongoose";

import { ROLE, SLOT_STATUS, STRIPE_ACCOUNT_STATUS, WORKER_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import User from "@/models/user.model";
import Worker from "@/models/worker.model";
import {
  IWorker,
  NearbyWorkerEntity,
  WorkerListingEntity,
  WorkerListingFilters,
  WorkerSummaryEntity,
} from "@/types/worker";
import { timeToMinutes } from "@/utils/time.convert";
import { getCurrentTime, getTodayKey, getTodayStart, getTodayEnd } from "@/utils/time.utils";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
  constructor() {
    super(Worker);
  }

  async getWorkerSummary(workerId: string): Promise<WorkerSummaryEntity | null> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(workerId),
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
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          displayName: 1,
          tagline: 1,
          coverImage: 1,
          about: 1,
          experience: 1,
          worksCompleted: 1,
          reviewCount: 1,
          defaultRate: 1,
          averageRating: 1,
          completionRate: 1,
          cities: 1,
          skills: 1,
          isPremium: 1,
          profileImage: "$user.profileImage",
          profile: "$user.profile",
          createdAt: 1,
        },
      },
    ];

    const result = await this.model.aggregate<WorkerSummaryEntity>(pipeline).exec();
    return result[0];
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
    params: WorkerListingFilters
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }> {
    const {
      lng,
      lat,
      limit,
      page,
      availableNow = false,
      maxPrice,
      minPrice,
      minRating,
      radiusKm,
    } = params;

    const nowMinutes = timeToMinutes(getCurrentTime());
    const PREP_BUFFER = 15;

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
            stripeAccountStatus: STRIPE_ACCOUNT_STATUS.ACTIVE,
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
                          as: "win",
                          cond: {
                            $and: [
                              { $lte: [this.toMinutes("$$win.startTime"), nowMinutes] },
                              {
                                $gte: [
                                  this.toMinutes("$$win.endTime"),
                                  {
                                    $add: [
                                      nowMinutes,
                                      { $multiply: ["$distanceKm", 3] },
                                      PREP_BUFFER,
                                      "$services.estimatedDuration",
                                      "$services.bufferTime",
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            } as PipelineStage,
            {
              $lookup: {
                from: "leaves",
                let: { wId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$workerId", "$$wId"] },
                          { $lte: ["$startDate", getTodayEnd()] },
                          { $gte: ["$endDate", getTodayStart()] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: "todayLeaves",
              },
            },
            { $match: { todayLeaves: { $size: 0 } } } as PipelineStage,
            {
              $lookup: {
                from: "slots",
                let: { wId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$workerId", "$$wId"] },
                          { $gte: ["$date", getTodayStart()] },
                          { $lte: ["$date", getTodayEnd()] },
                          { $eq: ["$isFullDay", true] },
                          { $in: ["$status", [SLOT_STATUS.RESERVED, SLOT_STATUS.BOOKED]] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: "fullDaySlots",
              },
            } as PipelineStage,
            { $match: { fullDaySlots: { $size: 0 } } } as PipelineStage,
            {
              $lookup: {
                from: "slots",
                let: { wId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$workerId", "$$wId"] },
                          { $gte: ["$date", getTodayStart()] },
                          { $lte: ["$date", getTodayEnd()] },
                          { $eq: ["$isFullDay", false] },
                          { $in: ["$status", [SLOT_STATUS.RESERVED, SLOT_STATUS.BOOKED]] },
                          { $lt: ["$startTime", getCurrentTime()] },
                          { $gt: ["$endTime", getCurrentTime()] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: "activeSlots",
              },
            } as PipelineStage,
            { $match: { activeSlots: { $size: 0 } } } as PipelineStage,
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
                serviceId: "$services._id",
                workerId: "$_id",
                userId: "$userId",
                displayName: "$displayName",
                tagline: "$tagline",
                description: "$services.description",
                coverImage: "$coverImage",
                isPremium: "$isPremium",
                reviewCount: "$reviewCount",
                worksCompleted: "$worksCompleted",
                profileImage: "$user.profileImage",
                experience: "$experience",
                averageRating: "$averageRating",
                serviceRate: "$services.rate",
                estimatedDuration: "$services.estimatedDuration",
                categoryName: "$category.name",
                pricingMode: "$category.pricingMode",
                serviceType: "$category.serviceType",
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

  private toMinutes = (timeField: string) => ({
    $add: [
      { $multiply: [{ $toInt: { $substr: [timeField, 0, 2] } }, 60] },
      { $toInt: { $substr: [timeField, 3, 2] } },
    ],
  });
}
