import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import LeaveService from '@/services/leave.service';
import { type GetLeavesResponse, type CreateLeavePayload, type LeaveFilter } from '@/types/leave';

const LEAVE_KEYS = {
  all: ['worker-leaves'] as const,
  list: (filter: LeaveFilter) => ['worker-leaves', 'list', filter] as const,
  stats: ['worker-leaves', 'stats'] as const,
};

export const useWorkerLeaves = (filter: LeaveFilter) => {
  return useInfiniteQuery<
    GetLeavesResponse,
    Error,
    InfiniteData<GetLeavesResponse>,
    ReturnType<typeof LEAVE_KEYS.list>,
    string | undefined
  >({
    queryKey: LEAVE_KEYS.list(filter),
    queryFn: ({ pageParam }) => LeaveService.getLeaves({ filter, cursor: pageParam, limit: 10 }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
};

export const useLeaveStats = () => {
  return useQuery({
    queryKey: LEAVE_KEYS.stats,
    queryFn: LeaveService.getStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeavePayload) => LeaveService.createLeave(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAVE_KEYS.all });
    },
  });
};

export const useCancelLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leaveId: string) => LeaveService.cancelLeave(leaveId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAVE_KEYS.all });
    },
  });
};
