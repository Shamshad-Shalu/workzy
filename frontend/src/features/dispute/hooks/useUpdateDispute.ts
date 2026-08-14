import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking';
import { disputeService } from '@/services/dispute.service';

import { disputeKeys, type RaiseDisputeFormType } from '../index';

export function useUpdateDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { disputeId: string; data: RaiseDisputeFormType }>(
    {
      mutationFn: ({ disputeId, data }) => disputeService.updateDispute(disputeId, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: disputeKeys.all });
        qc.invalidateQueries({ queryKey: bookingKeys.all });
      },
    }
  );
}
