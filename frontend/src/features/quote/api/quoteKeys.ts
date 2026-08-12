import type { QuoteListQuery } from '@/types/quote';

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: (filters?: Omit<QuoteListQuery, 'cursor' | 'limit'>) =>
    filters
      ? ([...quoteKeys.all, 'list', filters] as const)
      : ([...quoteKeys.all, 'list'] as const),
  workerStats: (workerId?: string) =>
    workerId
      ? ([...quoteKeys.all, 'stats', workerId] as const)
      : ([...quoteKeys.all, 'stats'] as const),
  detail: (id: string) => [...quoteKeys.all, 'detail', id] as const,
};
