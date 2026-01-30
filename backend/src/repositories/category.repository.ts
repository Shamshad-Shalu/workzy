import { BaseRepository } from "@/core/abstracts/base.repository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import Category from "@/models/category.model";
import {
  CategoryAncestor,
  CategoryLite,
  CategorySuggestionEntity,
  ICategory,
} from "@/types/category";
import { buildCategoryFilter } from "@/utils/admin/buildCategoryFilter";
import { injectable } from "inversify";
import mongoose, { FilterQuery, Types } from "mongoose";
import { PipelineStage } from "mongoose";

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

  async findAncestors(categoryId: string): Promise<CategoryAncestor[]> {
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

    return this.model.aggregate<CategoryAncestor>(pipeline).exec();
  }

  findCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLite[]> {
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
      .select("_id name level")
      .sort({ createdAt: 1 })
      .lean<CategoryLite[]>();
  }

  async findSuggestions(search: string, limit: number): Promise<CategorySuggestionEntity[]> {
    const filter: FilterQuery<ICategory> = {
      name: { $regex: search, $options: "i" },
      isAvailable: true,
      level: { $ne: 1 },
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
      });
    }
    return Array.from(uniqueMap.values());
  }
}
