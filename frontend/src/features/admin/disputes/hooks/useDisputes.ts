import { useMutation, useQueryClient } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';

import type { DisputeResolveFormType } from '../validation/disputeResolveFormData';

export function useResolveDispute() {
  const qc = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { disputeId: string; data: DisputeResolveFormType }
  >({
    mutationFn: ({ disputeId, data }) => disputeService.resolveDispute(disputeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dispute-details'] });
      qc.invalidateQueries({ queryKey: ['disputes'] });
      qc.invalidateQueries({ queryKey: ['dispute-stats'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
