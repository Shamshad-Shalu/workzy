import { useCallback } from 'react';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

import { useQuotes } from './useQuotes';

interface UseQuoteListOptions {
  userId?: string;
  workerId?: string;
}

export function useQuoteList(options?: UseQuoteListOptions) {
  const { search, status, updateParams } = useUrlFilterParams();

  const { data, isLoading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQuotes({
      search,
      status,
      userId: options?.userId,
      workerId: options?.workerId,
    });

  const quotes = data?.pages.flatMap(p => p.quotes) ?? [];
  const hasActiveFilters = !!search || status !== 'all';

  const clearFilters = useCallback(() => {
    updateParams({ search: '', status: 'all' });
  }, [updateParams]);

  const handleSearchChange = useCallback(
    (v: string) => updateParams({ search: v }),
    [updateParams]
  );

  const handleStatusChange = useCallback(
    (v: string) => updateParams({ status: v }),
    [updateParams]
  );

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return {
    quotes,
    search,
    status,
    isLoading,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    hasActiveFilters,
    clearFilters,
    handleSearchChange,
    handleStatusChange,
    sentinelRef,
    updateParams,
  };
}
