import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { useToggleReviewVisibility } from '@/features/user/booking/hooks/useReview';
import BookingService from '@/services/booking.service';
import type { AdminBookingListQuery, BookingListingResponse } from '@/types/booking';

const LIMIT = 5;

export function useAdminBookings(filters: Omit<AdminBookingListQuery, 'limit' | 'cursor'>) {
  const filterKey = JSON.stringify(filters);

  return useInfiniteQuery<
    BookingListingResponse,
    Error,
    { pages: BookingListingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof bookingKeys.admin>,
    string | undefined
  >({
    queryKey: bookingKeys.admin(filterKey),
    queryFn: ({ pageParam }) =>
      BookingService.getBookings({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useAdminBookingHandler() {
  const { mutateAsync: toggleReviewVisibility, isPending: isTogglingReview } =
    useToggleReviewVisibility();

  const [extraChargeBId, setExtraChargeBId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ id: string; reviewId?: string } | null>(null);

  async function handleToggleReview() {
    if (!reviewData?.reviewId) {
      return;
    }

    const res = await toggleReviewVisibility({
      reviewId: reviewData.reviewId,
    });

    if (res?.message) {
      toast.success(res.message);
    }

    setReviewData(null);
  }

  return {
    extraCharge: {
      extraChargeBId,
      setExtraChargeBId,
    },
    review: {
      reviewData,
      setReviewData,
      handleToggleReview,
      isTogglingReview,
    },
  };
}
