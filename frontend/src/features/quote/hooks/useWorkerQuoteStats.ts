import { useQuery } from '@tanstack/react-query';

import QuoteService from '@/services/quote.service';

import { quoteKeys } from '../api/quoteKeys';

export function useWorkerQuoteStats(workerId?: string) {
  return useQuery({
    queryKey: quoteKeys.workerStats(workerId),
    queryFn: () => QuoteService.getWorkerQuoteStats(workerId),
    staleTime: 1000 * 60,
    enabled: !!workerId,
  });
}
