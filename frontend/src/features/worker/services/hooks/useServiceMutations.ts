import {
  useMutation,
  useQueries,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import ServiceMangement from '@/services/service.service';
import type { CategoryOption } from '@/types/category';
import type { ServiceFilters, ServiceResponse } from '@/types/service';

import type { ServiceFormType } from '../validation/ServiceFormData';

export function useServiceMutations(workerId: string, filters: ServiceFilters) {
  const queryClient = useQueryClient();

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

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormType }) =>
      ServiceMangement.updateService(id, data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
    },
  });

  const addServiceMutation = useMutation({
    mutationFn: (data: ServiceFormType) => ServiceMangement.addService(data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
      queryClient.invalidateQueries({ queryKey: ['worker-service-categories'] });
    },
  });

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => ServiceMangement.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
    },
  });

  return {
    data: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    error: servicesQuery.error,
    categoriesList: categoriesQuery.data?.categories ?? [],
    updateServiceMutation,
    addServiceMutation,
    toggleStatusMutation,
  };
}
