import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import QuoteService from '@/services/quote.service';
import type { QuoteListQuery } from '@/types/quote';

const LIMIT = 5;

export function useUserQuotes(filter?: Omit<QuoteListQuery, 'cursor' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: ['worker-quotes', filter?.search ?? 'all', filter?.status],
    queryFn: ({ pageParam }) =>
      QuoteService.listUserQuotes({
        search: filter?.search,
        status: filter?.status,
        limit: LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useAcceptQuote() {
  const mutation = useMutation({
    mutationFn: (quoteId: string) => QuoteService.acceptQuote(quoteId),
    onSuccess: ({ url }) => {
      setTimeout(() => {
        window.location.href = url;
      }, 50);
    },
  });

  return {
    acceptQuote: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useRejectQuote() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (quoteId: string) => QuoteService.rejectQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-quotes'] });
    },
  });

  return {
    rejectQuote: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
