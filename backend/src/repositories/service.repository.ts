import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { WORKER_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { CategoryOption } from "@/types/category";
import { CategorySearchMatch, ServiceMatchStage } from "@/types/mongo-filters.types";
import { IService } from "@/types/service";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";
import { WorkerListingEntity, WorkerListingFilters } from "@/types/worker";

import Service from "../models/service.model";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
  constructor() {
    super(Service);
  }

  async getWorkerServicesAggregate(
    workerId: string,
    page: number,
    limit: number,
    search: string,
    status: string,
    categoryId: string | null
  ): Promise<WorkerServicesAggregationResult> {
    const skip = (page - 1) * limit;

    const matchStage: ServiceMatchStage = {
      workerId: new Types.ObjectId(workerId),
    };

    if (status === "active") matchStage.isAvailable = true;
    if (status === "blocked") matchStage.isAvailable = false;

    const categoryFilters: CategorySearchMatch[] = [];

    if (search) {
      categoryFilters.push({
        $or: [
          { "category.name": { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (categoryId) {
      const categoryObjectId = new Types.ObjectId(categoryId);
      categoryFilters.push({
        $or: [{ "category.parentId": categoryObjectId }],
      });
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      ...(categoryFilters.length ? [{ $match: { $and: categoryFilters } }] : []),
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          services: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                workerId: 1,
                categoryId: 1,
                serviceName: "$category.name",
                serviceType: "$category.serviceType",
                pricingMode: "$category.pricingMode",
                imageUrl: "$category.imageUrl",
                rate: 1,
                description: 1,
                experience: 1,
                estimatedDuration: 1,
                bufferTime: 1,
                maxTravelRadius: 1,
                allowSuddenBooking: 1,
                maxTravelCost: 1,
                isAvailable: 1,
                bulkDiscounts: 1,
                createdAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          services: 1,
          total: {
            $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0],
          },
        },
      },
    ];

    const [result] = await this.model.aggregate<WorkerServicesAggregationResult>(pipeline).exec();

    return {
      services: result?.services ?? [],
      total: result.total ?? 0,
    };
  }

  async getWorkerServiceParentCategories(workerId: string): Promise<CategoryOption[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
          isAvailable: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "categories",
          localField: "category.parentId",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      { $unwind: "$parentCategory" },
      {
        $group: {
          _id: "$parentCategory._id",
          name: { $first: "$parentCategory.name" },
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          name: 1,
        },
      },
      { $sort: { name: 1 } },
    ];
    return this.model.aggregate(pipeline).exec();
  }
  async listWorkers(
    serviceId: string,
    filters: WorkerListingFilters
  ): Promise<{ total: number; workersRaw: WorkerListingEntity[] }> {
    const { minPrice, maxPrice, minRating = 0, page, limit } = filters;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          categoryId: new Types.ObjectId(serviceId),
          isAvailable: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { categoryId: "$categoryId" },
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
                $gte: ["$rate", minPrice ?? { $divide: ["$category.baseRate", 2] }],
              },
              {
                $lte: ["$rate", maxPrice ?? { $multiply: ["$category.baseRate", 2] }],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "workers",
          let: { workerId: "$workerId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$workerId"] },
                status: WORKER_STATUS.VERIFIED,
                ...(minRating !== undefined && { averageRating: { $gte: minRating } }),
              },
            },
          ],
          as: "worker",
        },
      },
      { $match: { "worker.0": { $exists: true } } },
      { $unwind: "$worker" },

      {
        $lookup: {
          from: "users",
          localField: "worker.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.isBlocked": false } },
      {
        $facet: {
          workersRaw: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                workerId: "$workerId",
                userId: "$worker.userId",
                displayName: "$worker.displayName",
                tagline: "$worker.tagline",
                description: "$description",
                coverImage: "$worker.coverImage",
                isPremium: "$worker.isPremium",
                reviewCount: "$worker.reviewCount",
                worksCompleted: "$worker.worksCompleted",
                profileImage: "$user.profileImage",
                experience: "$experience",
                averageRating: "$worker.averageRating",
                serviceRate: "$rate",
                estimatedDuration: "$estimatedDuration",
                categoryName: "$category.name",
                pricingMode: "$category.pricingMode",
                bulkDiscounts: {
                  $cond: [
                    { $gt: [{ $size: { $ifNull: ["$bulkDiscounts", []] } }, 0] },
                    "$bulkDiscounts",
                    null,
                  ],
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
