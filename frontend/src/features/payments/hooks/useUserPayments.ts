import { useInfiniteQuery } from '@tanstack/react-query';

import { paymentKeys } from '@/features/payments';
import PaymentService from '@/services/payment.service';
import type { PaymentListQuery, PaymentUserResponse } from '@/types/payment';

const LIMIT = 5;

export function useUserPayments(filters: Omit<PaymentListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery<
    PaymentUserResponse,
    Error,
    { pages: PaymentUserResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof paymentKeys.user>,
    string | undefined
  >({
    queryKey: paymentKeys.user(filters),

    queryFn: ({ pageParam }) =>
      PaymentService.getUserPayments({
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
