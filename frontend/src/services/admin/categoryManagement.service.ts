import { ADMIN_API } from '@/constants';
import type { CategoryFormData } from '@/features/admin/service/validation/categorySchema';
import api from '@/lib/api/axios';

const AdminCategoryService = {
  toggleStatus: async (categoryId: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.CATEGORY.CATEGORY_STATUS(categoryId));
    return res.data;
  },

  createCategory: async (data: CategoryFormData) => {
    const response = await api.post(ADMIN_API.CATEGORY.CATEGORIES, data);
    return response.data;
  },

  updateCategory: async (id: string, data: CategoryFormData) => {
    const response = await api.patch(ADMIN_API.CATEGORY.CATEGORY_BY_ID(id), data);
    return response.data;
  },
};

export default AdminCategoryService;
