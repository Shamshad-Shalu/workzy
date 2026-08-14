import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking';
import { disputeService } from '@/services/dispute.service';

import { disputeKeys, type RaiseDisputeFormType } from '../index';

export function useRaiseDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { bookingId: string; data: RaiseDisputeFormType }>(
    {
      mutationFn: ({ bookingId, data }) => disputeService.raiseDispute(bookingId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: disputeKeys.all });
        qc.invalidateQueries({ queryKey: bookingKeys.all });
      },
    }
  );
}
