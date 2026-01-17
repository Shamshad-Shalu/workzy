import api from '@/lib/api/axios';
import type { Category, CategoryResponse } from '@/types/admin/category';

const CategoryService = {
  getCategories: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    parentId: string | null = null
  ): Promise<CategoryResponse> => {
    const res = await api.get('/categories', {
      params: { page, limit, search, status, parentId },
    });
    return res.data;
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    const res = await api.get(`/categories/${categoryId}`);
    return res.data?.category;
  },
};

export default CategoryService;
