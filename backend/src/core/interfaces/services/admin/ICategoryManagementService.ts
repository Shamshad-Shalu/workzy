import { CategoryRequestDTO, CategoryUpdateRequestDTO } from "@/dtos/requests/category.dto";
import { CategoryResponseDTO } from "@/dtos/responses/admin/category.response.dto";

export interface ICategoryManagementService {
  createCategory(serviceData: CategoryRequestDTO): Promise<CategoryResponseDTO>;
  toggleCategoryStatus(categoryId: string): Promise<{ newStatus: boolean; message: string }>;
  updateCategory(
    categoryId: string,
    updateData: CategoryUpdateRequestDTO
  ): Promise<CategoryResponseDTO>;
}
