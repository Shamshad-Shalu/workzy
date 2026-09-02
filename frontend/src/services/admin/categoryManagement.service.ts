import { ADMIN_API } from '@/constants';
import type { CategoryFormData } from '@/features/admin/service/validation/categorySchema';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { Category } from '@/types/category';

const AdminCategoryService = {
  toggleStatus: async (categoryId: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<{ isAvailable: boolean }>>(
      ADMIN_API.CATEGORY.CATEGORY_STATUS(categoryId)
    );
    return { message: res.data.message };
  },

  createCategory: async (
    data: CategoryFormData
  ): Promise<{ message: string; category: Category }> => {
    const res = await api.post<ApiResponse<{ category: Category }>>(
      ADMIN_API.CATEGORY.CATEGORIES,
      data
    );
    return {
      message: res.data.message,
      category: res.data.data.category,
    };
  },

  updateCategory: async (
    id: string,
    data: CategoryFormData
  ): Promise<{ message: string; category: Category }> => {
    const res = await api.patch<ApiResponse<{ category: Category }>>(
      ADMIN_API.CATEGORY.CATEGORY_BY_ID(id),
      data
    );
    return {
      message: res.data.message,
      category: res.data.data.category,
    };
  },
};

export default AdminCategoryService;
