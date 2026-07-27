import { useMutation, useQueryClient } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';

import type { RaiseDisputeFormType } from '../validation/raiseDispute.schema';

export function useUpdateDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { disputeId: string; data: RaiseDisputeFormType }>(
    {
      mutationFn: ({ disputeId, data }) => disputeService.updateDispute(disputeId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['dispute-details'] });
        qc.invalidateQueries({ queryKey: ['disputes'] });
        qc.invalidateQueries({ queryKey: ['dispute-stats'] });
        qc.invalidateQueries({ queryKey: ['bookings'] });
      },
    }
  );
}
