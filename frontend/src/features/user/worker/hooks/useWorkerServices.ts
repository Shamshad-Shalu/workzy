import { useInfiniteQuery } from '@tanstack/react-query';

import type { ServiceType } from '@/constants';
import type { ApiError } from '@/lib/api/apiError';
import ServiceManagement from '@/services/service.service';
import type { PublicWorkerServicesResponse } from '@/types/service';

const LIMIT = 6;

export function useWorkerServices(
  workerId?: string,
  query?: { search?: string; type?: ServiceType | 'all' }
) {
  return useInfiniteQuery<
    PublicWorkerServicesResponse,
    ApiError,
    { pages: PublicWorkerServicesResponse[]; pageParams: (string | undefined)[] },
    string[],
    string | undefined
  >({
    queryKey: ['public-services', workerId ?? 'null', query?.search ?? '', query?.type ?? 'all'],
    queryFn: ({ pageParam }) => {
      if (!workerId) {
        throw new Error('workerId is required');
      }
      return ServiceManagement.listWorkerPublicServices(workerId, {
        limit: LIMIT,
        cursor: pageParam,
        search: query?.search ?? '',
        type: query?.type ?? 'all',
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    enabled: !!workerId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
