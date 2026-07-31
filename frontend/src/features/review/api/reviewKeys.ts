import type { AdminReviewListQuery, ReviewListQuery } from '@/types/review';
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  user: (filters: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'user', filters] as const,
  worker: (filters?: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'worker', filters] as const,
  workerStats: (workerId?: string) => [...reviewKeys.all, 'stats', workerId] as const,
  public: (workerId?: string, filters?: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'public', workerId, filters] as const,
  admin: (filters: Omit<AdminReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'admin', filters] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
};
