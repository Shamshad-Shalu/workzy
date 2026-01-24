import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";
import { CategoryAncestor } from "@/types/category";

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
}
