import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { STRIPE_ACCOUNT_STATUS } from '@/constants/payment';
import WorkerService from '@/services/worker.service';
import { handleApiError } from '@/utils/handleApiError';

export function useStripeConnect() {
  const { data: account } = useQuery({
    queryKey: ['stripe-status'],
    queryFn: () => WorkerService.getStripeStatus(),
  });

  const { mutate: connectStripe, isPending: isConnecting } = useMutation({
    mutationFn: () => WorkerService.connectStripe(),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: err => toast.error(handleApiError(err)),
  });

  return {
    stripeAccountId: account?.stripeAccountId ?? null,
    isConnected: account?.status === STRIPE_ACCOUNT_STATUS.ACTIVE,
    isPending: account?.status === STRIPE_ACCOUNT_STATUS.PENDING,
    isConnecting,
    connectStripe,
  };
}
