import { useMutation, useQueries } from '@tanstack/react-query';
import { toast } from 'sonner';

import { SUBSCRIPTION_STATUS, type BillingCycle } from '@/constants';
import PlanService from '@/services/plan.service';
import SubscriptionService from '@/services/subscription.service';
import { handleApiError } from '@/utils/handleApiError';

export function useSubscriptions() {
  const [offersQuery, subQuery] = useQueries({
    queries: [
      {
        queryKey: ['plans', 'active-offers'],
        queryFn: () => PlanService.getActiveOffers(),
        staleTime: 600_000,
      },
      {
        queryKey: ['subscriptions', 'me'],
        queryFn: () => SubscriptionService.getMySubscription(),
        staleTime: 30_000,
      },
    ],
  });

  const addSubscription = useMutation({
    mutationFn: (data: { planId: string; billingCycle: BillingCycle }) =>
      SubscriptionService.addSubscription(data),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });

  const subscription = subQuery.data?.subscription ?? null;

  return {
    plans: offersQuery.data,
    plansError: offersQuery.error,
    plansLoading: offersQuery.isLoading,
    currentSub: subscription,
    isSubLoading: subQuery.isLoading,
    subError: subQuery.error,
    isActive: subscription?.status === SUBSCRIPTION_STATUS.ACTIVE,
    isExpired: subscription?.status === SUBSCRIPTION_STATUS.EXPIRED,
    addSubscription,
  };
}
