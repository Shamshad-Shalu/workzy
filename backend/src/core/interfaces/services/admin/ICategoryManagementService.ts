import { CategoryRequestDTO } from "@/dtos/requests/category.dto";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";

export interface ICategoryManagementService {
  createCategory(data: CategoryRequestDTO): Promise<CategoryResponseDTO>;
  toggleCategoryStatus(categoryId: string): Promise<{ newStatus: boolean; message: string }>;
  updateCategory(categoryId: string, data: CategoryRequestDTO): Promise<CategoryResponseDTO>;
}
