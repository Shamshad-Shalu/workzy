import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import QuoteService from '@/services/quote.service';
import SlotService from '@/services/slot.service';
import type { DateRangeFilter } from '@/types/slot';

import type { QuoteFormType } from '../validation/quoteSchema';


export function useQuoteAvailableDates(serviceId?: string, filters?: DateRangeFilter) {
  const query = useQuery({
    queryKey: ['quotes-available-dates', serviceId, filters?.startDate, filters?.endDate],
    queryFn: () => {
      if (!serviceId) {throw new Error('serviceId is required');}
      return SlotService.getAvailableDatesForQuotes(serviceId, filters);
    },
    staleTime: 1000 * 60,
    enabled: !!serviceId,
  });

  return {
    dates: query.data?.dates ?? {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// const LIMIT = 5;

// export function useWorkerQuotes(
//   query: Omit<ReviewListQuery, 'cursor' | 'limit'>
// ) {
//   return useInfiniteQuery<
//     PublicReviewListResponse,
//     Error,
//     { pages: PublicReviewListResponse[]; pageParams: (string | undefined)[] },
//     ReturnType<typeof reviewKeys.public>,
//     string | undefined
//   >({
//     queryKey: reviewKeys.public(workerId ?? 'disabled', query),
//     queryFn: ({ pageParam }) =>
//       ReviewService.getPublicWorkerReviews(workerId!, {
//         limit: LIMIT,
//         cursor: pageParam,
//         ...query,
//       }),
//     initialPageParam: undefined,
//     getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
//     staleTime: 1000 * 60 * 2,
//     gcTime: 1000 * 60 * 5,
//     enabled: !!workerId,
//   });
// }

export function useCreateQuote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: QuoteFormType) => QuoteService.createQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes-available-dates'] });
      queryClient.invalidateQueries({ queryKey: ['worker-quotes'] });
    },
  });

  return {
    createQuote: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
