import { useQuery } from '@tanstack/react-query';

import SlotService from '@/services/slot.service';
import type { DateRangeFilter } from '@/types/slot';

export function useQuoteAvailableDates(serviceId?: string, filters?: DateRangeFilter) {
  const query = useQuery({
    queryKey: ['quotes-available-dates', serviceId, filters?.startDate, filters?.endDate],
    queryFn: () => {
      if (!serviceId) {
        throw new Error('serviceId is required');
      }
      return SlotService.getAvailableDatesForQuotes(serviceId, filters);
    },
    staleTime: 1000 * 60,
    refetchOnMount: 'always',
    enabled: !!serviceId,
  });

  return {
    dates: query.data?.dates ?? {},
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
