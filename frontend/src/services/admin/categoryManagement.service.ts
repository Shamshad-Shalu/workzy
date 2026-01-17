import api from '@/lib/api/axios';
import { ADMIN_ROUTES } from '@/constants';
import type { CategoryFormData } from '@/features/admin/service/validation/categorySchema';

const AdminCategoryService = {
  toggleStatus: async (categoryId: string): Promise<{ message: string }> => {
    const res = await api.patch(`${ADMIN_ROUTES.TOGGLESERVICESTATUS}/${categoryId}`);
    return res.data;
  },

  createCategory: async (data: CategoryFormData) => {
    const response = await api.post(ADMIN_ROUTES.ADDCATEGORY, data);
    return response.data;
  },

  updateCategory: async (id: string, data: CategoryFormData) => {
    const response = await api.patch(`${ADMIN_ROUTES.EDITCATEGORY}/${id}`, data);
    return response.data;
  },
};

export default AdminCategoryService;
