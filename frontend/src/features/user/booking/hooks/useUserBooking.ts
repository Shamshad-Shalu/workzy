import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import type { BookingFilterStatus } from '@/constants';
import {
  bookingKeys,
  useApproveBooking,
  useCancelBooking,
  usePayExtraCharge,
} from '@/features/booking/hooks/useBooking';
import { useRaiseDispute } from '@/features/booking/hooks/useDispute';
import BookingService from '@/services/booking.service';
import type { BookingListingResponse, BookingListItem } from '@/types/booking';

import { useCreateBookingReview, useEditBookingReview } from './useReview';

import type { DisputeFormType } from '../components/bookingActions/DisputeModal';
import type { ReviewFormType } from '../validation/ReviewFormData';

const LIMIT = 5;

export function useUserBookings(status: BookingFilterStatus) {
  return useInfiniteQuery<
    BookingListingResponse,
    Error,
    { pages: BookingListingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof bookingKeys.user>,
    string | undefined
  >({
    queryKey: bookingKeys.user(status),
    queryFn: ({ pageParam }) =>
      BookingService.getUserBookings({
        status,
        limit: LIMIT,
        cursor: pageParam ? JSON.parse(pageParam) : null,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 5000,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 10000,
  });
}

export function useUserBookingHandler() {
  const [cancelB, setCancelB] = useState<BookingListItem | null>(null);
  const [approveBId, setApproveBId] = useState<string | null>(null);
  const [evidenceBId, setEvidenceBId] = useState<string | null>(null);
  const [payExtraBId, setPayExtraBId] = useState<string | null>(null);
  const [disputeBId, setDisputeBId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ id: string; reviewId?: string } | null>(null);

  const { mutateAsync: cancel, isPending: isCancelling } = useCancelBooking();
  const { mutateAsync: approve, isPending: isApproving } = useApproveBooking();
  const { mutateAsync: payExtra, isPending: isPayingExtra } = usePayExtraCharge();
  const { mutateAsync: raiseDispute, isPending: isRaisingDispute } = useRaiseDispute();
  const { mutateAsync: addReview } = useCreateBookingReview();
  const { mutateAsync: editReview } = useEditBookingReview();

  const handleCancelBooking = async (reason: string) => {
    if (!cancelB?.id) {
      return;
    }
    await cancel({ id: cancelB.id, reason });
    setCancelB(null);
  };

  const handleApproveBooking = async () => {
    if (!approveBId) {
      return;
    }
    const res = await approve(approveBId);
    if (res.message) {
      toast.success(res.message);
    }
    setApproveBId(null);
  };

  const handlePayExtra = async () => {
    if (!payExtraBId) {
      return;
    }
    const res = await payExtra(payExtraBId);
    if (res.url) {
      window.location.href = res.url;
    }
    setPayExtraBId(null);
  };

  const handleRaiseDispute = async (data: DisputeFormType) => {
    if (!disputeBId) {
      return;
    }
    await raiseDispute({ bookingId: disputeBId, data });
    setDisputeBId(null);
  };

  const handleSubmitReview = async (data: ReviewFormType) => {
    const { rating, reviewText, media } = data;
    if (reviewData?.reviewId) {
      const res = await editReview({
        reviewId: reviewData.reviewId,
        data: {
          media,
          rating,
          reviewText,
        },
      });
      if (res.message) {
        toast.success(res.message);
      }
    } else {
      const res = await addReview(data);
      if (res.message) {
        toast.success(res.message);
      }
    }
    setReviewData(null);
  };

  return {
    cancel: {
      cancelB,
      setCancelB,
      handleCancelBooking,
      isCancelling,
    },
    approve: {
      approveBId,
      setApproveBId,
      handleApproveBooking,
      isApproving,
    },
    payExtra: {
      payExtraBId,
      setPayExtraBId,
      handlePayExtra,
      isPayingExtra,
    },
    dispute: {
      disputeBId,
      setDisputeBId,
      handleRaiseDispute,
      isRaisingDispute,
    },
    evidence: {
      evidenceBId,
      setEvidenceBId,
    },
    review: {
      reviewData,
      setReviewData,
      handleSubmitReview,
    },
  };
}
