import { BaseRepository } from "@/core/abstracts/base.repository";
import {
  CategoryAncestorEntity,
  CategoryLevelsEntity,
  CategorySuggestionEntity,
  ICategory,
  ServiceItemEntity,
} from "@/types/category";

export interface ICategoryRepository extends BaseRepository<ICategory> {
  getAllCategories(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<ICategory[]>;
  findAncestors(categoryId: string): Promise<CategoryAncestorEntity[]>;
  findCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLevelsEntity[]>;
  findSuggestions(search: string, limit: number): Promise<CategorySuggestionEntity[]>;
  findServicesByCategory(categoryId: string, limit: number): Promise<ServiceItemEntity[]>;
}
