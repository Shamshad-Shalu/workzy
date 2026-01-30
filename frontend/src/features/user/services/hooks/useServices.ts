import CategoryService from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';

export const useCategorySuggestions = (search: string, searchEnabled?: boolean) => {
  return useQuery({
    queryKey: ['category-suggestions', search],
    queryFn: () => CategoryService.getCategoriesSuggestions(search),
    enabled: searchEnabled,
    staleTime: 1000 * 60,
  });
};

export const useTrendingCategories = (enabled: boolean) => {
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: CategoryService.getTrendingCategories,
    enabled,
    staleTime: 1000 * 60 * 10, // 10 min cache
  });
};
