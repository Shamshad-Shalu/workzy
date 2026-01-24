import api from '@/lib/api/axios';
import type { Category, CategoryAncestor, CategoryResponse } from '@/types/admin/category';

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
  getCategoryAncestors: async (categoryId: string): Promise<CategoryAncestor[]> => {
    const res = await api.get(`/categories/${categoryId}/ancestors`);
    return res.data.ancestors;
  },
};

export default CategoryService;
