import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { ROLE } from '@/constants';
import BookingCard from '@/features/booking/components/BookingCard';
import { BookingCardSkeleton } from '@/features/booking/components/BookingCardSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { BookingListItem } from '@/types/booking';

interface BookingListProps {
  bookings: BookingListItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  role: (typeof ROLE)[keyof typeof ROLE];
  onAccept?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStart?: (booking: BookingListItem) => void;
  onCancel?: (booking: BookingListItem) => void;
  onReached?: (id: string) => void;
  onComplete?: (id: string) => void;
  onDispute?: (id: string) => void;
  onEnRoute?: (id: string) => void;
  onReqExtra?: (id: string) => void;
  onPayExtra?: (id: string) => void;
  detailBasePath?: string;
}

export function BookingList({
  bookings,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  role,
  onAccept,
  onReached,
  onReject,
  onEnRoute,
  onStart,
  onCancel,
  onComplete,
  onReqExtra,
  onApprove,
  onPayExtra,
  onDispute,
  detailBasePath = '/bookings',
}: BookingListProps) {
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load bookings"
        description="Something went wrong while fetching your bookings."
        onRetry={refetch}
      />
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="w-6 h-6" />}
        title="No bookings found"
        description="Your bookings will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {bookings.map((booking, i) => (
          <BookingCard
            key={booking?.id}
            booking={booking}
            role={role}
            index={i}
            detailPath={`${detailBasePath}/${booking?.id}`}
            handlers={{
              onAccept,
              onStart,
              onCancel,
              onReached,
              onEnRoute,
              onReject,
              onComplete,
              onReqExtra,
              onApprove,
              onDispute,
              onPayExtra,
            }}
          />
        ))}
      </AnimatePresence>
      <div ref={sentinelRef} className="h-4" />

      {isFetchingNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
