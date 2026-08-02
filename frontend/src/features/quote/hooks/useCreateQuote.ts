import { useMutation, useQueryClient } from '@tanstack/react-query';

import { quoteKeys, type CreateQuoteFormType } from '@/features/quote';
import QuoteService from '@/services/quote.service';

export function useCreateQuote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuoteFormType) => QuoteService.createQuote(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: quoteKeys.all });
      await qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
