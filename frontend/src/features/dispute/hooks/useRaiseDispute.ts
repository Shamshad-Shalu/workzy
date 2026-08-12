import { useMutation, useQueryClient } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';

import type { RaiseDisputeFormType } from '../validation/raiseDispute.schema';

export function useRaiseDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { bookingId: string; data: RaiseDisputeFormType }>(
    {
      mutationFn: ({ bookingId, data }) => disputeService.raiseDispute(bookingId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['dispute-details'] });
        qc.invalidateQueries({ queryKey: ['bookings'] });
        qc.invalidateQueries({ queryKey: ['dispute-stats'] });
      },
    }
  );
}
