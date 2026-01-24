import { BaseRepository } from "@/core/abstracts/base.repository";
import { CategoryAncestor, ICategory } from "@/types/category";

export interface ICategoryRepository extends BaseRepository<ICategory> {
  getAllCategories(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<ICategory[]>;
  findAncestors(categoryId: string): Promise<CategoryAncestor[]>;
}
