import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking';
import { disputeService } from '@/services/dispute.service';

import { disputeKeys, type ResolveDisputeFormType } from '../index';

export function useResolveDispute() {
  const qc = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { disputeId: string; data: ResolveDisputeFormType }
  >({
    mutationFn: ({ disputeId, data }) => disputeService.resolveDispute(disputeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: disputeKeys.all });
      qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
