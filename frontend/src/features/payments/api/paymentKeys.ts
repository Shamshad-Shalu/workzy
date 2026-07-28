import type { AdminPaymentListQuery, PaymentListQuery } from '@/types/payment';

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
