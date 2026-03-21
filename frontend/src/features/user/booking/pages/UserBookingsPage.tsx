import { AnimatePresence, motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { BOOKING_EMPTY_MESSAGES, type BookingFilterStatus } from '@/constants';
import type { BookingCard } from '@/types/booking';

import ApproveModal from '../components/bookingActions/ApproveModal';
import BookingCardSkeletonList from '../components/bookingActions/BookingCardSkeleton';
import { BookingStatusTabs } from '../components/bookingActions/BookingStatusTabs';
import CancelModal from '../components/bookingActions/CancelModal';
import DetailModal from '../components/bookingActions/DetailModal';
import EvidenceModal from '../components/bookingActions/EvidenceModal';
import ExtraChargeModal from '../components/bookingActions/ExtraChargeModal';
import UserBookingCard, { type BookingCardHandlers } from '../components/bookingActions/UserBookingCard';
import { useBookingMutations } from '../hooks/useBookingMutations';
import { useUserBookings } from '../hooks/useUserBookings';

export default function UserBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingFilterStatus>('all');

  const [detailId, setDetailId] = useState<string | null>(null);
  const [cancelB, setCancelB] = useState<BookingCard | null>(null);
  const [evidenceB, setEvidenceB] = useState<BookingCard | null>(null);
  const [payExtraB, setPayExtraB] = useState<BookingCard | null>(null);
  const [approveB, setApproveB] = useState<BookingCard | null>(null);
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [reviewB, setReviewB] = useState<string | null>(null);

  console.log({ disputeId , reviewB })
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useUserBookings(activeTab);

  const { cancelBookingMutation } = useBookingMutations();

  const bookings = data?.pages.flatMap(p => p.data) ?? [];
  const total = data?.pages[0].total;

  console.log('booking::', bookings);

  const handlers: BookingCardHandlers = {
    onView: id => setDetailId(id),
    onCancel: booking => setCancelB(booking),
    onPayExtra: booking => setPayExtraB(booking),
    onApprove: booking => setApproveB(booking),
    onEvidence: booking => setEvidenceB(booking),
    onDispute: id => setDisputeId(id),
    onReview: id => setReviewB(id),
  };

  const handleTabChange = (tab: BookingFilterStatus) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {return;}

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

  const cancelBooking = async (reason: string) => {
    if (!cancelB?.id) {return;}
    await cancelBookingMutation.mutateAsync({ id: cancelB.id, reason });
    setCancelB(null);
  };

  const apporveBooking = async (id: string) => {
    console.log('id::', id);
    setApproveB(null);
  };

  const onExtraPayment = async (id: string) => {
    console.log('id::', id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage all your service requests
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
                  <UserBookingCard 
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

      <CancelModal
        open={!!cancelB}
        booking={cancelB}
        onSubmit={cancelBooking}
        onClose={() => setCancelB(null)}
        isSubmitting={cancelBookingMutation.isPending}
      />

      <ExtraChargeModal
        open={!!payExtraB}
        booking={payExtraB}
        onPayAmount={onExtraPayment}
        onClose={() => setPayExtraB(null)}
      />
      <EvidenceModal open={!!evidenceB} booking={evidenceB} onClose={() => setEvidenceB(null)} />
      <DetailModal open={!!detailId} onClose={() => setDetailId(null)} bookingId={detailId} />
      <ApproveModal
        open={!!approveB}
        onClose={() => setApproveB(null)}
        booking={approveB}
        onSubmit={apporveBooking}
      />

      {/* 

      <DisputeModal     id={disputeId}  open={!!disputeId}  onClose={() => setDisputeId(null)} />
      <ReviewModal      booking={reviewB}  open={!!reviewB}    onClose={() => setReviewB(null)} />
      */}
    </div>
  );
}
