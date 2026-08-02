import { useQuery } from '@tanstack/react-query';

import QuoteService from '@/services/quote.service';

import { quoteKeys } from '../api/quoteKeys';

export function useWorkerQuoteStats() {
  return useQuery({
    queryKey: quoteKeys.workerStats(),
    queryFn: () => QuoteService.getWorkerQuoteStats(),
    staleTime: 1000 * 60,
  });
}
