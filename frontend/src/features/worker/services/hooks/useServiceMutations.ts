import ServiceMangement from '@/services/service.service';
import type { CategoryOption } from '@/types/category';
import type { ServiceFilters, ServiceResponse } from '@/types/service';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';

export function useServiceMutations(workerId: string, filters: ServiceFilters) {
  //   const queryClient = useQueryClient();

  const { pageIndex, pageSize, search, status, categoryId } = filters;

  const results = useQueries({
    queries: [
      {
        queryKey: [
          'worker-services',
          workerId,
          { pageIndex, pageSize, search, status, categoryId },
        ],
        queryFn: () =>
          ServiceMangement.getServices(workerId, {
            page: pageIndex + 1,
            limit: pageSize,
            search,
            status,
            categoryId,
          }),
        staleTime: 1000 * 10,
        enabled: !!workerId,
        placeholderData: (prev: ServiceResponse | undefined) => prev,
      },
      {
        queryKey: ['worker-service-categories'],
        queryFn: () => ServiceMangement.getWorkerServiceCategories(workerId),
        enabled: !!workerId,
      },
    ],
  }) as [
    UseQueryResult<ServiceResponse, Error>,
    UseQueryResult<{ categories: CategoryOption[] }, Error>,
  ];

  const [servicesQuery, categoriesQuery] = results;

  return {
    data: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    error: servicesQuery.error,
    categoriesList: categoriesQuery.data?.categories ?? [],
  };
}
