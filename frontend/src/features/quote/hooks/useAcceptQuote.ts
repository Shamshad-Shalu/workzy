import { useMutation } from '@tanstack/react-query';

import QuoteService from '@/services/quote.service';

export function useAcceptQuote() {
  return useMutation({
    mutationFn: (quoteId: string) => QuoteService.acceptQuote(quoteId),
    onSuccess: ({ url }) => {
      setTimeout(() => {
        window.location.href = url;
      }, 50);
    },
  });
}
