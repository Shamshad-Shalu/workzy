import { injectable } from "inversify";
import mongoose, { FilterQuery, Types } from "mongoose";
import { PipelineStage } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import Category from "@/models/category.model";
import {
  CategoryAncestorEntity,
  CategoryLevelsEntity,
  CategoryListEntity,
  CategorySuggestionEntity,
  ICategory,
  PublicCategoriesParams,
  ServiceItemEntity,
  ServiceSort,
} from "@/types/category";
import { buildCategoryFilter } from "@/utils/admin/filters/buildCategoryFilter";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
  constructor() {
    super(Category);
  }

  async getAllCategories(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<ICategory[]> {
    const filter = buildCategoryFilter(search, status, parentId);
    return this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }

  async findAncestors(categoryId: string): Promise<CategoryAncestorEntity[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: new Types.ObjectId(categoryId) },
      },
      {
        $graphLookup: {
          from: "categories",
          startWith: "$parentId",
          connectFromField: "parentId",
          connectToField: "_id",
          as: "parents",
        },
      },
      {
        $project: {
          ancestors: {
            $concatArrays: [["$$ROOT"], "$parents"],
          },
        },
      },
      { $unwind: "$ancestors" },
      {
        $project: {
          _id: "$ancestors._id",
          name: "$ancestors.name",
          level: "$ancestors.level",
          parentId: "$ancestors.parentId",
        },
      },
      {
        $sort: { level: 1 },
      },
    ];

    return this.model.aggregate<CategoryAncestorEntity>(pipeline).exec();
  }

  findCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLevelsEntity[]> {
    const filter: FilterQuery<ICategory> = {
      level,
      isAvailable: true,
    };

    if (parentId !== null) {
      filter.parentId = new Types.ObjectId(parentId);
    } else {
      filter.parentId = null;
    }
    return this.model
      .find(filter)
      .select("_id name level iconUrl")
      .sort({ createdAt: 1 })
      .lean<CategoryLevelsEntity[]>();
  }

  async findSuggestions(search: string, limit: number): Promise<CategorySuggestionEntity[]> {
    const filter: FilterQuery<ICategory> = {
      name: { $regex: search, $options: "i" },
      isAvailable: true,
    };

    type SuggestionDoc = CategorySuggestionEntity & {
      parentId?: mongoose.Types.ObjectId | null;
    };

    const matches = await this.model
      .find(filter)
      .select("_id name iconUrl level parentId")
      .limit(limit)
      .lean<SuggestionDoc[]>();

    if (matches.length === 0) return [];

    const level2Ids = matches.filter((cat) => cat.level === 2).map((cat) => cat._id);

    let children: SuggestionDoc[] = [];

    if (level2Ids.length > 0) {
      children = await this.model
        .find({
          parentId: { $in: level2Ids },
          isAvailable: true,
          level: 3,
        })
        .select("_id name iconUrl level parentId")
        .lean<SuggestionDoc[]>();
    }

    const combined = [...matches, ...children];

    const uniqueMap = new Map<string, CategorySuggestionEntity>();

    for (const item of combined) {
      uniqueMap.set(item._id.toString(), {
        _id: item._id,
        name: item.name,
        iconUrl: item.iconUrl,
        level: item.level,
        parentId: item.parentId,
      });
    }
    return Array.from(uniqueMap.values());
  }

  async findPublicCategories(
    filters: PublicCategoriesParams
  ): Promise<{ data: CategoryListEntity[]; nextCursor: string | null }> {
    const { categoryId, sortBy = "newest", limit, cursor } = filters;

    let lastValue: string | undefined;
    let lastId: string | undefined;
    if (cursor) {
      try {
        const [v, id] = Buffer.from(cursor, "base64").toString("utf-8").split("|");
        lastValue = v;
        lastId = id;
      } catch {
        console.error("error");
      }
    }
    const query: FilterQuery<ICategory> = {
      level: 2,
      isAvailable: true,
    };

    if (categoryId) {
      query.parentId = new Types.ObjectId(categoryId);
    }
    const { sort, field } = this.getSortConfig(sortBy);
    const cursorFilter = this.getCursorFilter(sortBy, lastValue, lastId);

    const docs = await this.model
      .find({ ...query, ...cursorFilter })
      .select("name description iconUrl imageUrl baseRate parentId createdAt _id")
      .sort(sort)
      .limit(limit + 1)
      .lean<CategoryListEntity[]>()
      .exec();
    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();

    const nextCursor = hasMore
      ? Buffer.from(
          `${field === "baseRate" ? docs[docs.length - 1].baseRate : docs[docs.length - 1].createdAt.toISOString()}|${docs[docs.length - 1]._id.toString()}`
        ).toString("base64")
      : null;

    return { data: docs, nextCursor };
  }

  async findServicesByCategory(categoryId: string, limit: number): Promise<ServiceItemEntity[]> {
    const _id = new mongoose.Types.ObjectId(categoryId);

    const pipeline: PipelineStage[] = [
      {
        $match: { _id, isAvailable: true },
      },
      {
        $lookup: {
          from: "categories",
          let: { parentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$parentId", "$$parentId"] },
                isAvailable: true,
              },
            },
            { $sort: { name: 1 } },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                let: { parent2: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$parentId", "$$parent2"] },
                      isAvailable: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "subServices",
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                imageUrl: 1,
                iconUrl: 1,
                baseRate: 1,
                subServices: 1,
              },
            },
          ],
          as: "services",
        },
      },
      {
        $project: {
          _id: 1,
          services: 1,
        },
      },
    ];

    const result = await this.model
      .aggregate<{
        _id: mongoose.Types.ObjectId;
        services: ServiceItemEntity[];
      }>(pipeline)
      .exec();

    return result[0]?.services || [];
  }

  private getSortConfig(sortBy: ServiceSort) {
    const sortMap: Record<
      ServiceSort,
      { sort: Record<string, 1 | -1>; field: "baseRate" | "createdAt" }
    > = {
      price_asc: { sort: { baseRate: 1, _id: 1 }, field: "baseRate" },
      price_desc: { sort: { baseRate: -1, _id: -1 }, field: "baseRate" },
      newest: { sort: { createdAt: -1, _id: -1 }, field: "createdAt" },
      popular: { sort: { createdAt: 1, _id: 1 }, field: "createdAt" },
    };
    return sortMap[sortBy] ?? sortMap.newest;
  }
  private getCursorFilter(
    sortBy: ServiceSort,
    lastValue?: string,
    lastId?: string
  ): FilterQuery<ICategory> {
    if (!lastValue || !lastId) return {};
    const oid = new Types.ObjectId(lastId);
    if (sortBy === "price_asc") {
      return {
        $or: [
          { baseRate: { $gt: Number(lastValue) } },
          { baseRate: Number(lastValue), _id: { $gt: oid } },
        ],
      };
    } else if (sortBy === "price_desc") {
      return {
        $or: [
          { baseRate: { $lt: Number(lastValue) } },
          { baseRate: Number(lastValue), _id: { $lt: oid } },
        ],
      };
    } else if (sortBy === "popular") {
      return {
        $or: [
          { createdAt: { $gt: new Date(lastValue) } },
          { createdAt: new Date(lastValue), _id: { $gt: oid } },
        ],
      }; // 👈 ascending
    } else {
      return {
        $or: [
          { createdAt: { $lt: new Date(lastValue) } },
          { createdAt: new Date(lastValue), _id: { $lt: oid } },
        ],
      };
    }
  }
}
