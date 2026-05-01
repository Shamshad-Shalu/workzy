import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import ServiceMangement from '@/services/service.service';
import type { ServiceFilters, WorkerServicesResponse } from '@/types/service';

import type { ServiceFormType } from '../validation/ServiceFormData';

export function useWorkerServices(filters: ServiceFilters) {
  return useInfiniteQuery<
    WorkerServicesResponse,
    Error,
    InfiniteData<WorkerServicesResponse>,
    [string, typeof filters],
    string | undefined
  >({
    queryKey: ['worker-services', filters],
    queryFn: ({ pageParam }) =>
      ServiceMangement.getServices({
        ...filters,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  });
}

export function useWorkerServiceCategories() {
  const query = useQuery({
    queryKey: ['worker-service-categories'],
    queryFn: () => ServiceMangement.getWorkerServiceCategories(),
  });

  return {
    categories: query.data?.categories ?? [],
    isLoading: query.isLoading,
  };
}
export function useAddService() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ServiceFormType) => ServiceMangement.addService(data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
      queryClient.invalidateQueries({ queryKey: ['worker-service-categories'] });
    },
  });

  return {
    addService: mutation.mutateAsync,
    isAddingService: mutation.isPending,
    error: mutation.error,
  };
}
export function useUpdateService() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormType }) =>
      ServiceMangement.updateService(id, data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
    },
  });

  return {
    updateService: mutation.mutateAsync,
    isUpdatingService: mutation.isPending,
    error: mutation.error,
  };
}

export function useToggleServiceStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => ServiceMangement.toggleStatus(id),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['worker-services'] });
    },
  });

  return {
    toggleServiceStatus: mutation.mutateAsync,
    isTogglingStatus: mutation.isPending,
  };
}
