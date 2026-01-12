import { BaseRepository } from "@/core/abstracts/base.repository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import Category from "@/models/category.model";
import { ICategory } from "@/types/category";
import { buildCategoryFilter } from "@/utils/admin/buildCategoryFilter";
import { injectable } from "inversify";

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
}
