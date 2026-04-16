import { useInfiniteQuery } from '@tanstack/react-query';

import PaymentService from '@/services/payment.service';
import type {
  AdminPaymentListQuery,
  PaymentAdminResponse,
  PaymentListQuery,
} from '@/types/payment';

const LIMIT = 5;

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  admin: (filters: Omit<AdminPaymentListQuery, 'limit' | 'cursor'>) =>
    [...paymentKeys.lists(), 'admin', filters] as const,
  worker: (filters: Omit<PaymentListQuery, 'limit' | 'cursor'>) =>
    [...paymentKeys.lists(), 'worker', filters] as const,
  user: (filters: Omit<PaymentListQuery, 'limit' | 'cursor'>) =>
    [...paymentKeys.lists(), 'user', filters] as const,
};

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
