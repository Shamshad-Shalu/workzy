import { useQuery } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';

import { disputeKeys } from '../index';

export function useDisputeStats(params: { userId?: string; workerId?: string } = {}) {
  return useQuery({
    queryKey: disputeKeys.stats(params),
    queryFn: () => disputeService.getDisputeStats(params),
    staleTime: 1000 * 60 * 10,
  });
}
