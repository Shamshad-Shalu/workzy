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
import BookingService from '@/services/booking.service';
import type { BookingListingResponse, BookingListItem } from '@/types/booking';

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
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useUserBookingHandler() {
  const [cancelB, setCancelB] = useState<BookingListItem | null>(null);
  const [approveBId, setApproveBId] = useState<string | null>(null);
  const [evidenceBId, setEvidenceBId] = useState<string | null>(null);
  const [payExtraBId, setPayExtraBId] = useState<string | null>(null);

  const { mutateAsync: cancel, isPending: cancelPending } = useCancelBooking();
  const { mutateAsync: approve, isPending: approvePending } = useApproveBooking();
  const { mutateAsync: payExtra, isPending: payExtraPending } = usePayExtraCharge();

  const submitCancel = async (reason: string) => {
    if (!cancelB?.id) {
      return;
    }
    await cancel({ id: cancelB.id, reason });
    setCancelB(null);
  };

  const submitApprove = async () => {
    if (!approveBId) {
      return;
    }
    const res = await approve(approveBId);
    if (res.message) {
      toast.success(res.message);
    }
    setApproveBId(null);
  };
  const submitPayExtra = async () => {
    if (!payExtraBId) {
      return;
    }
    const res = await payExtra(payExtraBId);
    if (res.url) {
      window.location.href = res.url;
    }
    setPayExtraBId(null);
  };

  console.log('extra', { payExtraBId, payExtraPending });

  return {
    cancel: {
      cancelB,
      setCancelB,
      submitCancel,
      cancelPending,
    },
    approve: {
      approveBId,
      setApproveBId,
      submitApprove,
      approvePending,
    },
    payExtra: {
      payExtraBId,
      setPayExtraBId,
      submitPayExtra,
      payExtraPending,
    },
    evidence: {
      evidenceBId,
      setEvidenceBId,
    },
  };
}
