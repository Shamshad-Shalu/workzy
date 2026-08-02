import { useInfiniteQuery } from '@tanstack/react-query';

import { quoteKeys } from '@/features/quote';
import QuoteService from '@/services/quote.service';
import type { QuoteListQuery } from '@/types/quote';

const LIMIT = 5;

export function useQuotes(filter?: Omit<QuoteListQuery, 'cursor' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: quoteKeys.lists(filter ?? {}),
    queryFn: ({ pageParam }) =>
      QuoteService.listQuotes({
        limit: LIMIT,
        cursor: pageParam,
        ...filter,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
