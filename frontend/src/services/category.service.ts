import { CATEGORY_API } from '@/constants';
import api from '@/lib/api/axios';
import type { CategoryAncestor, CategoryResponse } from '@/types/admin/category';
import type { Category, CategoryLite, CategorySuggestion } from '@/types/category';

const CategoryService = {
  getCategories: async (
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    parentId: string | null = null
  ): Promise<CategoryResponse> => {
    const res = await api.get(CATEGORY_API.ROOT, {
      params: { page, limit, search, status, parentId },
    });
    return res.data;
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    const res = await api.get(CATEGORY_API.BY_ID(categoryId));
    return res.data.category;
  },
  getCategoryAncestors: async (categoryId: string): Promise<CategoryAncestor[]> => {
    const res = await api.get(CATEGORY_API.ANCESTORS(categoryId));
    return res.data.ancestors;
  },
  getCategoryLevels: async (level = 1, parentId?: string | null): Promise<CategoryLite[]> => {
    const res = await api.get(CATEGORY_API.LEVELS, {
      params: { level, parentId },
    });
    return res.data.categories;
  },

  getCategoriesSuggestions: async (search: string): Promise<CategorySuggestion[]> => {
    const res = await api.get(CATEGORY_API.CATEGORY_SUGGESTIONS, {
      params: { search, limit: 20 },
    });
    return res.data.results;
  },
  getTrendingCategories: async (): Promise<CategorySuggestion[]> => {
    const res = await api.get(CATEGORY_API.TRENDING);
    return res.data.results;
  },

  getPublicCategories: async (filters: {
    categoryId?: string;
    sortBy?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ categories: Category[]; nextCursor: string | null }> => {
    const res = await api.get(CATEGORY_API.DISCOVERY, {
      params: filters,
    });
    return res.data;
  },
};

export default CategoryService;
