import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { CategoryOption } from "@/types/category";
import { CategorySearchMatch, ServiceMatchStage } from "@/types/mongo-filters.types";
import { IService } from "@/types/service";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";

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
}
