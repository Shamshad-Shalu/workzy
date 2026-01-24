import {
  useMutation,
  useQueries,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CategoryFormData } from '../validation/categorySchema';
import CategoryService from '@/services/category.service';
import type {
  Category,
  CategoryAncestor,
  CategoryFilters,
  CategoryResponse,
} from '@/types/admin/category';
import AdminCategoryService from '@/services/admin/categoryManagement.service';

export function useCategoryMutations(filters: CategoryFilters) {
  const queryClient = useQueryClient();

  const { pageIndex, pageSize, search, status, parentId } = filters;

  const results = useQueries({
    queries: [
      {
        queryKey: ['admin-categories', pageIndex, pageSize, search, status, parentId],
        queryFn: () =>
          CategoryService.getCategories(pageIndex + 1, pageSize, search, status, parentId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev: CategoryResponse | undefined) => prev,
      },
      {
        queryKey: ['category', parentId],
        queryFn: () => CategoryService.getCategory(parentId as string),
        enabled: !!parentId,
      },
      {
        queryKey: ['category-ancestors', parentId],
        queryFn: () => CategoryService.getCategoryAncestors(parentId as string),
        enabled: !!parentId,
      },
    ],
  }) as [
    UseQueryResult<CategoryResponse, Error>,
    UseQueryResult<Category | null, Error>,
    UseQueryResult<CategoryAncestor[] | null, Error>,
  ];

  const [categoriesQuery, parentCategoryQuery, categoryAncestors] = results;

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      AdminCategoryService.updateCategory(id, data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => AdminCategoryService.createCategory(data),

    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminCategoryService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  return {
    data: categoriesQuery.data,
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    updateCategoryMutation,
    addCategoryMutation,
    toggleStatusMutation,
    categoryAncestors: categoryAncestors.data ?? [],
    parentCategory: parentCategoryQuery.data,
  };
}
