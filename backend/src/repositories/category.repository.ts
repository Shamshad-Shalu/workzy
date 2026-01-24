import { BaseRepository } from "@/core/abstracts/base.repository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import Category from "@/models/category.model";
import { CategoryAncestor, ICategory } from "@/types/category";
import { buildCategoryFilter } from "@/utils/admin/buildCategoryFilter";
import { injectable } from "inversify";
import { Types } from "mongoose";
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
}
