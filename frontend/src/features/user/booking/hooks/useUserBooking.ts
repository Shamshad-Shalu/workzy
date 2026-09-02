import { useState } from 'react';
import { toast } from 'sonner';

import {
  useApproveBooking,
  useCancelBooking,
  usePayExtraCharge,
} from '@/features/booking/hooks/useBooking';
import { useCreateReview, useUpdateReview, type CreateReviewFormType } from '@/features/review';
import type { BookingDetails, BookingListItem } from '@/types/booking';

export function useUserBookingHandler() {
  const [cancelB, setCancelB] = useState<BookingListItem | BookingDetails | null>(null);
  const [approveBId, setApproveBId] = useState<string | null>(null);
  const [evidenceBId, setEvidenceBId] = useState<string | null>(null);
  const [payExtraBId, setPayExtraBId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ id: string; reviewId?: string } | null>(null);

  const { mutateAsync: cancel, isPending: isCancelling } = useCancelBooking();
  const { mutateAsync: approve, isPending: isApproving } = useApproveBooking();
  const { mutateAsync: payExtra, isPending: isPayingExtra } = usePayExtraCharge();
  const { mutateAsync: addReview } = useCreateReview();
  const { mutateAsync: editReview } = useUpdateReview();

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
    if (res?.url) {
      window.location.href = res.url;
    }
    setPayExtraBId(null);
  };

  const handleSubmitReview = async (data: CreateReviewFormType) => {
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
