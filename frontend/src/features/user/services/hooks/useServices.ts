import { useQuery } from '@tanstack/react-query';

import CategoryService from '@/services/category.service';

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

export const useListingServices = (level = 3, parentId: string | null) => {
  return useQuery({
    queryKey: ['services-available', level, parentId],
    queryFn: () => CategoryService.getCategoryLevels(level, parentId),
    enabled: !!parentId,
  });
};

export const useServiceDetails = (serviceId?: string | null) => {
  return useQuery({
    queryKey: ['service-details', serviceId],
    queryFn: () => CategoryService.getCategory(serviceId!),
    enabled: !!serviceId,
  });
};
