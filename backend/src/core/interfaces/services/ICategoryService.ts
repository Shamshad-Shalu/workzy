import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import {
  CategoryAncestorResponseDTO,
  CategoryLiteDTO,
  CategoryServicesResponseDTO,
  CategorySuggestionResponseDTO,
  CategoryTrendingResponseDTO,
} from "@/dtos/responses/category.dto";

export interface ICategoryService {
  getCategories(
    page: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<{ categories: CategoryResponseDTO[]; total: number }>;
  getCategoryById(categoryId: string): Promise<CategoryResponseDTO>;
  getCategoryAncestors(categoryId: string): Promise<CategoryAncestorResponseDTO[]>;
  getCategoriesByLevel(level: number, parentId: string | null): Promise<CategoryLiteDTO[]>;
  getCategorySuggestions(search: string, limit: number): Promise<CategorySuggestionResponseDTO[]>;
  getTrendingCategories(limit: number): Promise<CategoryTrendingResponseDTO[]>;
  getServicesByCategory(categoryId: string, limit: number): Promise<CategoryServicesResponseDTO[]>;
}
