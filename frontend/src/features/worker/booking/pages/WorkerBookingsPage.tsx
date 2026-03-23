import { AnimatePresence, motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { BOOKING_EMPTY_MESSAGES, type BookingFilterStatus } from '@/constants';
import BookingCardSkeletonList from '@/features/user/booking/components/bookingActions/BookingCardSkeleton';
import { BookingStatusTabs } from '@/features/user/booking/components/bookingActions/BookingStatusTabs';
import type { BookingCard } from '@/types/booking';

import WorkerAcceptModal from '../components/WorkerAcceptModal';
import WorkerBookingCard, { type WorkerBookingCardHandlers } from '../components/WorkerBookingCard';
import WorkerBookingDetailModal from '../components/WorkerBookingDetailModal';
import WorkerCompleteModal, { type BookigCompleteForm } from '../components/WorkerCompleteModal';
import WorkerExtraChargeModal from '../components/WorkerExtraChargeModal';
import WorkerRejectModal from '../components/WorkerRejectModal';
import WorkerStartJobModal from '../components/WorkerStartJobModal';
import { useWorkerBookingMutations } from '../hooks/useWorkerBookingMutations';
import { useWorkerBookings } from '../hooks/useWorkerBookings';

import type { ExtraChargeFormType } from '../validation/extraChargeSchema';

export default function WorkerBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingFilterStatus>('all');

  const [detailId, setDetailId] = useState<string | null>(null);
  const [acceptB, setAcceptB] = useState<BookingCard | null>(null);
  const [rejectB, setRejectB] = useState<BookingCard | null>(null);
  const [extraB, setExtraB] = useState<BookingCard | null>(null);
  const [completeB, setCompleteB] = useState<BookingCard | null>(null);
  const [startB, setStartB] = useState<BookingCard | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useWorkerBookings(activeTab);

  const {
    acceptBookingMutation,
    rejectBookingMutation,
    startJobMutation,
    completeJobMutation,
    requestExtraChargeMutation,
  } = useWorkerBookingMutations();

  const bookings = data?.pages.flatMap(p => p.data) ?? [];
  const total = data?.pages[0].total;

  const onStartSubmit = async (id: string) => {
    await startJobMutation.mutateAsync(id);
    setStartB(null);
  };

  const handlers: WorkerBookingCardHandlers = {
    onView: id => setDetailId(id),
    onAccept: id => {
      const b = bookings.find(x => x.id === id);
      if (b) {
        setAcceptB(b);
      }
    },
    onReject: booking => setRejectB(booking),
    onStart: id => {
      const b = bookings.find(x => x.id === id);
      if (b) {
        setStartB(b);
      }
    },
    onComplete: booking => setCompleteB(booking),
    onRequestExtra: booking => setExtraB(booking),
  };

  const handleTabChange = (tab: BookingFilterStatus) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onRejectSubmit = async (reason: string) => {
    if (!rejectB?.id) {
      return;
    }
    await rejectBookingMutation.mutateAsync({ id: rejectB.id, reason });
    setRejectB(null);
  };

  const onAcceptSubmit = async (id: string) => {
    await acceptBookingMutation.mutateAsync(id);
    setAcceptB(null);
  };

  const onExtraSubmit = async (data: ExtraChargeFormType) => {
    if (!extraB?.id) {
      return;
    }
    await requestExtraChargeMutation.mutateAsync({ id: extraB.id, data });
    setExtraB(null);
  };

  const onCompleteSubmit = async (data: BookigCompleteForm) => {
    if (!completeB?.id) {
      return;
    }
    await completeJobMutation.mutateAsync({ id: completeB.id, data });
    setCompleteB(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Worker Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your service requests and track your jobs
          </p>
        </motion.div>

        <BookingStatusTabs active={activeTab} onChange={handleTabChange} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isLoading && <BookingCardSkeletonList count={4} />}
            {isError && !isLoading && (
              <ErrorState
                title="Failed to load bookings"
                description={(error as Error)?.message ?? 'Something went wrong. Please try again.'}
                onRetry={refetch}
              />
            )}
            {!isLoading && !isError && bookings.length === 0 && (
              <EmptyState
                title={BOOKING_EMPTY_MESSAGES[activeTab].title}
                description={BOOKING_EMPTY_MESSAGES[activeTab].sub}
                icon={<FileText />}
              />
            )}

            {!isLoading && !isError && bookings.length > 0 && (
              <div className="space-y-3">
                {bookings.map((booking, i) => (
                  <WorkerBookingCard
                    key={booking.id}
                    booking={booking}
                    handlers={handlers}
                    index={i % 10}
                  />
                ))}

                {isFetchingNextPage && <BookingCardSkeletonList count={2} />}
                <div ref={sentinelRef} className="h-1" />
                {!hasNextPage && (
                  <p className="text-center text-xs text-muted-foreground py-6">
                    {total ? `All ${total} bookings loaded` : 'No more bookings'}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <WorkerBookingDetailModal
        open={!!detailId}
        onClose={() => setDetailId(null)}
        bookingIdByCard={detailId}
      />

      <WorkerAcceptModal
        open={!!acceptB}
        booking={acceptB}
        onClose={() => setAcceptB(null)}
        onSubmit={onAcceptSubmit}
        isSubmitting={acceptBookingMutation.isPending}
      />

      <WorkerRejectModal
        open={!!rejectB}
        booking={rejectB}
        onClose={() => setRejectB(null)}
        onSubmit={onRejectSubmit}
        isSubmitting={rejectBookingMutation.isPending}
      />

      <WorkerExtraChargeModal
        open={!!extraB}
        booking={extraB}
        onClose={() => setExtraB(null)}
        onSubmit={onExtraSubmit}
        isSubmitting={requestExtraChargeMutation.isPending}
      />

      <WorkerCompleteModal
        open={!!completeB}
        booking={completeB}
        onClose={() => setCompleteB(null)}
        onSubmit={onCompleteSubmit}
        isSubmitting={completeJobMutation.isPending}
      />

      <WorkerStartJobModal
        open={!!startB}
        booking={startB}
        onClose={() => setStartB(null)}
        onSubmit={onStartSubmit}
        isSubmitting={startJobMutation.isPending}
      />
    </div>
  );
}
