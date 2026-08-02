import { useMutation, useQueryClient } from '@tanstack/react-query';

import { quoteKeys, type EditQuoteFormType } from '@/features/quote';
import QuoteService from '@/services/quote.service';

export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, data }: { quoteId: string; data: EditQuoteFormType }) =>
      QuoteService.updateQuote(quoteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all });
      queryClient.invalidateQueries({ queryKey: ['quotes-available-dates'] });
    },
  });
}
