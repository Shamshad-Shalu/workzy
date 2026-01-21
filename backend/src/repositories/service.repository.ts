import { BaseRepository } from "@/core/abstracts/base.repository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { IService } from "@/types/service";
import { injectable } from "inversify";
import Service from "../models/service.model";
import { CategorySearchMatch, ServiceMatchStage } from "@/types/mongo-filters.types";
import { PipelineStage, Types } from "mongoose";
import { WorkerServicesAggregationResult } from "@/types/service-aggregation.types";

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
                _id: 1,
                workerId: 1,
                categoryId: 1,
                serviceName: "$category.name",
                serviceType: "$category.serviceType",
                pricingMode: "$category.pricingMode",

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
}
