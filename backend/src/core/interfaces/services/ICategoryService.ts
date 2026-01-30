import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import {
  CategorySuggestionResponseDTO,
  CategoryTrendingResponseDTO,
} from "@/dtos/responses/category.dto";
import { CategoryAncestor, CategoryLiteDTO } from "@/types/category";

export interface ICategoryService {
  getCategories(
    page: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<{ categories: CategoryResponseDTO[]; total: number }>;
  getCategoryById(categoryId: string): Promise<CategoryResponseDTO>;
  getCategoryAncestors(categoryId: string): Promise<CategoryAncestor[]>;
  getCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLiteDTO[]>;
  getCategorySuggestions(search: string, limit: number): Promise<CategorySuggestionResponseDTO[]>;
  getTrendingCategories(limit: number): Promise<CategoryTrendingResponseDTO[]>;
}
