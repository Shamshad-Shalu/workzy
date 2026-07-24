import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import { CategoryOption } from "@/types/category";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IService } from "@/types/service/service.entity";
import { PublicWorkerServiceItem, WorkerServiceItem } from "@/types/service/service.projection";
import { PublicServiceListQuery, ServiceListQuery } from "@/types/service/service.query";

import Service from "../models/service.model";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
  constructor() {
    super(Service);
  }

  async listWorkerServices(
    workerId: string,
    query: ServiceListQuery
  ): Promise<CursorPaginatedResult<WorkerServiceItem>> {
    const { limit, status, categoryId, cursor, search } = query;
    const pipeline: PipelineStage[] = [
      {
        $match: {
          workerId: new Types.ObjectId(workerId),
          ...(status !== "all" && { isAvailable: status === "active" }),
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
      {
        $unwind: "$category",
      },
    ];
    if (search) {
      pipeline.push({ $match: { "category.name": { $regex: search, $options: "i" } } });
    }
    if (categoryId) {
      pipeline.push({ $match: { "category.parentId": new Types.ObjectId(categoryId) } });
    }

    if (cursor) {
      pipeline.push({
        $match: {
          $or: [
            { createdAt: { $lt: cursor.createdAt } },
            {
              createdAt: cursor.createdAt,
              _id: { $lt: new Types.ObjectId(cursor._id) },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 1,
          workerId: 1,
          rate: 1,
          description: 1,
          estimatedDuration: 1,
          bufferTime: 1,
          maxTravelRadius: 1,
          bulkDiscounts: 1,
          allowSuddenBooking: 1,
          isAvailable: 1,
          experience: 1,
          maxTravelCost: 1,
          createdAt: 1,
          categoryId: {
            _id: "$category._id",
            name: "$category.name",
            maxTravelCost: "$category.maxTravelCost",
            iconUrl: "$category.iconUrl",
            imageUrl: "$category.imageUrl",
            serviceType: "$category.serviceType",
            pricingMode: "$category.pricingMode",
          },
        },
      }
    );

    const docs = await this.model.aggregate<WorkerServiceItem>(pipeline);

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
      nextCursor,
    };
  }

  async listWorkerPublicServices(
    workerId: string,
    query: PublicServiceListQuery
  ): Promise<CursorPaginatedResult<PublicWorkerServiceItem>> {
    const { limit, type, cursor, search } = query;

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
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "categories",
          localField: "category.parentId",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: {
          path: "$parentCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (type !== "all") {
      pipeline.push({
        $match: { "category.serviceType": type },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "category.name": { $regex: search, $options: "i" } },
            { "parentCategory.name": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (cursor) {
      pipeline.push({
        $match: {
          $or: [
            { createdAt: { $lt: cursor.createdAt } },
            {
              createdAt: cursor.createdAt,
              _id: { $lt: new Types.ObjectId(cursor._id) },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 1,
          categoryId: 1,
          rate: 1,
          description: 1,
          estimatedDuration: 1,
          bulkDiscounts: 1,
          experience: 1,
          createdAt: 1,
          serviceName: "$category.name",
          categoryName: "$parentCategory.name",
          iconUrl: "$category.iconUrl",
          imageUrl: "$category.imageUrl",
          serviceType: "$category.serviceType",
          pricingMode: "$category.pricingMode",
        },
      }
    );

    const docs = await this.model.aggregate<PublicWorkerServiceItem>(pipeline);

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
      nextCursor,
    };
  }

  async getWorkerServiceCategories(workerId: string): Promise<CategoryOption[]> {
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

  async getServiceById(serviceId: string): Promise<WorkerServiceItem | null> {
    return await this.model
      .findById(serviceId)
      .populate("categoryId", "name iconUrl imageUrl serviceType pricingMode")
      .lean<WorkerServiceItem>();
  }
}
