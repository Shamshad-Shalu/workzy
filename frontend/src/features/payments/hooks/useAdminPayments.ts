import { useInfiniteQuery } from '@tanstack/react-query';

import { paymentKeys } from '@/features/payments';
import PaymentService from '@/services/payment.service';
import type { AdminPaymentListQuery, PaymentAdminResponse } from '@/types/payment';

const LIMIT = 5;

export function useAdminPayments(filters: Omit<AdminPaymentListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery<
    PaymentAdminResponse,
    Error,
    { pages: PaymentAdminResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof paymentKeys.admin>,
    string | undefined
  >({
    queryKey: paymentKeys.admin(filters),
    queryFn: ({ pageParam }) =>
      PaymentService.getAdminPayments({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),

    initialPageParam: undefined,

    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
