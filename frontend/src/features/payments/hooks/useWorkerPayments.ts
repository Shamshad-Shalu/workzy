import { useInfiniteQuery } from '@tanstack/react-query';

import { paymentKeys } from '@/features/payments';
import PaymentService from '@/services/payment.service';
import type { PaymentListQuery, PaymentWorkerResponse } from '@/types/payment';

const LIMIT = 5;

export function useWorkerPayments(filters: Omit<PaymentListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery<
    PaymentWorkerResponse,
    Error,
    { pages: PaymentWorkerResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof paymentKeys.worker>,
    string | undefined
  >({
    queryKey: paymentKeys.worker(filters),

    queryFn: ({ pageParam }) =>
      PaymentService.getWorkerPayments({
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
