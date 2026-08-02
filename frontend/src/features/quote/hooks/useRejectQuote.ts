import { useMutation, useQueryClient } from '@tanstack/react-query';

import { quoteKeys } from '@/features/quote';
import QuoteService from '@/services/quote.service';

export function useRejectQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: string) => QuoteService.rejectQuote(quoteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: quoteKeys.all });
    },
  });
}
