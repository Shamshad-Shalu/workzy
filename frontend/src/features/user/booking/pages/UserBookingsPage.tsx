// import { AnimatePresence, motion } from 'framer-motion';
// import { FileText } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// import EmptyState from '@/components/molecules/EmptyState';
// import ErrorState from '@/components/molecules/ErrorState';
// import { BOOKING_EMPTY_MESSAGES, type BookingFilterStatus } from '@/constants';
// import BookingCard from '@/features/booking/components/BookingCard';
// import type { BookingListItem } from '@/types/booking';

// import BookingCardSkeletonList from '../../../booking/components/BookingCardSkeleton';
// import { BookingStatusTabs } from '../../../booking/components/BookingStatusTabs';
// import ApproveModal from '../components/bookingActions/ApproveModal';
// import CancelModal from '../components/bookingActions/CancelModal';
// import DisputeModal from '../components/bookingActions/DisputeModal';
// import EvidenceModal from '../components/bookingActions/EvidenceModal';
// import ExtraChargeModal from '../components/bookingActions/ExtraChargeModal';
// import { useBookingMutations } from '../hooks/useBookingMutations';
// import { useUserBookings } from '../hooks/useUserBooking';

// export default function UserBookingsPage() {

//   const [cancelB, setCancelB] = useState<BookingListItem | null>(null);
//   const [evidenceB, setEvidenceB] = useState<BookingListItem | null>(null);
//   const [payExtraB, setPayExtraB] = useState<BookingListItem | null>(null);
//   const [approveB, setApproveB] = useState<BookingListItem | null>(null);
//   const [disputeB, setDisputeB] = useState<BookingListItem | null>(null);
//   const [reviewB, _setReviewB] = useState<string | null>(null);

//   console.log({ reviewB });

//   const [status, setStatus] = useState<BookingFilterStatus>('all');
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     refetch,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     error,
//   } = useUserBookings(status);

//   const bookings = data?.pages.flatMap(p => p.booking) ?? [];

//   const {
//     cancelBookingMutation,
//     disputeBookingMutation,
//     approveBookingMutation,
//     payExtraChargeMutation,
//     rejectExtraChargeMutation,
//   } = useBookingMutations();

//   const handleTabChange = (s: BookingFilterStatus) => {
//     setStatus(s);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = sentinelRef.current;
//     if (!el) {
//       return;
//     }

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//           void fetchNextPage();
//         }
//       },
//       { rootMargin: '200px' }
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const cancelBooking = async (reason: string) => {
//     if (!cancelB?.id) {
//       return;
//     }
//     await cancelBookingMutation.mutateAsync({ id: cancelB.id, reason });
//     setCancelB(null);
//   };

//   const apporveBooking = async (id: string) => {
//     await approveBookingMutation.mutateAsync(id);
//     setApproveB(null);
//   };

//   const onExtraPayment = async (id: string) => {
//     await payExtraChargeMutation.mutateAsync(id);
//   };

//   const onExtraReject = async (id: string) => {
//     await rejectExtraChargeMutation.mutateAsync(id);
//     setPayExtraB(null);
//   };

//   const onDisputeSubmit = async (reason: string) => {
//     if (!disputeB) {
//       return;
//     }
//     await disputeBookingMutation.mutateAsync({ id: disputeB.id, reason });
//     setDisputeB(null);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="section-container py-8 space-y-6">
//         <motion.div
//           initial={{ opacity: 0, y: -6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//         >
//           <h1 className="text-2xl font-bold text-foreground tracking-tight">My Bookings</h1>
//           <p className="text-sm text-muted-foreground mt-0.5">
//             Track and manage all your service requests
//           </p>
//         </motion.div>

//         <BookingStatusTabs active={status} onChange={handleTabChange} />

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={status}
//             initial={{ opacity: 0, y: 4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.15 }}
//           >
//             {isLoading && <BookingCardSkeletonList count={4} />}
//             {isError && !isLoading && (
//               <ErrorState
//                 title="Failed to load bookings"
//                 description={(error as Error)?.message ?? 'Something went wrong. Please try again.'}
//                 onRetry={refetch}
//               />
//             )}
//             {!isLoading && !isError && bookings.length === 0 && (
//               <EmptyState
//                 title={BOOKING_EMPTY_MESSAGES[status].title}
//                 description={BOOKING_EMPTY_MESSAGES[status].sub}
//                 icon={<FileText />}
//               />
//             )}

//             {!isLoading && !isError && bookings.length > 0 && (
//               <div className="space-y-3">
//                 {bookings.map((booking, i) => (
//                   // <UserBookingCard
//                   //   key={booking.id}
//                   //   booking={booking}
//                   //   handlers={handlers}
//                   //   index={i % 10}
//                   // />
//                   <BookingCard booking={booking} index={i} role="user" />
//                 ))}

//                 {isFetchingNextPage && <BookingCardSkeletonList count={2} />}
//                 <div ref={sentinelRef} className="h-1" />
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       <CancelModal
//         open={!!cancelB}
//         booking={cancelB}
//         onSubmit={cancelBooking}
//         onClose={() => setCancelB(null)}
//         isSubmitting={cancelBookingMutation.isPending}
//       />

//       <ExtraChargeModal
//         open={!!payExtraB}
//         booking={payExtraB}
//         onPayAmount={onExtraPayment}
//         onReject={onExtraReject}
//         onClose={() => setPayExtraB(null)}
//         isSubmitting={payExtraChargeMutation.isPending || rejectExtraChargeMutation.isPending}
//       />
//       <EvidenceModal open={!!evidenceB} booking={evidenceB} onClose={() => setEvidenceB(null)} />
//       <ApproveModal
//         open={!!approveB}
//         onClose={() => setApproveB(null)}
//         booking={approveB}
//         onSubmit={apporveBooking}
//         isSubmitting={approveBookingMutation.isPending}
//       />
//       <DisputeModal
//         open={!!disputeB}
//         booking={disputeB}
//         onClose={() => setDisputeB(null)}
//         onSubmit={onDisputeSubmit}
//         isSubmitting={disputeBookingMutation.isPending}
//       />
//     </div>
//   );
// }

import { useState } from 'react';

import PageHeader from '@/components/molecules/PageHeader';
import { ROLE, type BookingFilterStatus } from '@/constants';
import { BookingList } from '@/features/booking/components/BookingList';
import { BookingStatusTabs } from '@/features/booking/components/BookingStatusTabs';

import ApproveModal from '../components/bookingActions/ApproveModal';
import CancelModal from '../components/bookingActions/CancelModal';
import ExtraChargeModal from '../components/bookingActions/ExtraChargeModal';
import { useUserBookingHandler, useUserBookings } from '../hooks/useUserBooking';

export default function UserBookingsPage() {
  const [status, setStatus] = useState<BookingFilterStatus>('all');

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserBookings(status);
  const { cancel, approve, payExtra } = useUserBookingHandler();
  const { cancelB, cancelPending, setCancelB, submitCancel } = cancel;
  const { payExtraBId, setPayExtraBId, payExtraPending, submitPayExtra } = payExtra;
  const { approveBId, setApproveBId, approvePending, submitApprove } = approve;

  const bookings = data?.pages.flatMap(p => p.bookings) ?? [];

  return (
    <div className="section-container py-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="My Bookings" description="Track and manage your service bookings" />
      </div>
      <BookingStatusTabs active={status} onChange={setStatus} />
      <BookingList
        bookings={bookings}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        refetch={refetch}
        role={ROLE.USER}
        onCancel={booking => setCancelB(booking)}
        onApprove={id => setApproveBId(id)}
        onPayExtra={id => setPayExtraBId(id)}
        detailBasePath="/bookings"
      />
      <CancelModal
        open={!!cancelB}
        booking={cancelB}
        onClose={() => setCancelB(null)}
        onSubmit={submitCancel}
        isSubmitting={cancelPending}
      />
      <ApproveModal
        open={!!approveBId}
        onClose={() => setApproveBId(null)}
        bookingId={approveBId}
        onSubmit={submitApprove}
        isSubmitting={approvePending}
      />
      <ExtraChargeModal
        open={!!payExtraBId}
        bookingId={payExtraBId}
        onClose={() => setPayExtraBId(null)}
        onPayAmount={submitPayExtra}
        isSubmitting={payExtraPending}
      />
    </div>
  );
}
