import { useState } from 'react';

import PageHeader from '@/components/molecules/PageHeader';
import { ROLE, type BookingFilterStatus } from '@/constants';
import { BookingList } from '@/features/booking/components/BookingList';
import { BookingStatusTabs } from '@/features/booking/components/BookingStatusTabs';

import WorkerAcceptModal from '../components/WorkerAcceptModal';
import WorkerCompleteModal from '../components/WorkerCompleteModal';
import WorkerExtraChargeModal from '../components/WorkerExtraChargeModal';
import WorkerRejectModal from '../components/WorkerRejectModal';
import WorkerReviewReplyModal from '../components/WorkerReviewModal';
import WorkerStartJobModal from '../components/WorkerStartJobModal';
import {
  useMarkEnRoute,
  useMarkReached,
  useWorkerBooking,
  useWorkerBookingHandler,
} from '../hooks/useWorkerBooking';

export default function WorkerBookingsPage() {
  const [status, setStatus] = useState<BookingFilterStatus>('all');
  const { mutateAsync: markEnRoute } = useMarkEnRoute();
  const { mutateAsync: markReached } = useMarkReached();

  const { accept, start, reject, finish, extraCharge, review } = useWorkerBookingHandler();
  const { extraChargeBId, setExtraChargeBId, handleExtraCharge, isRequestingExtraCharge } =
    extraCharge;
  const { setFinishBId, finishBId, isCompleting, handleFinishJob } = finish;
  const { setAcceptBId, acceptBId, isAccepting, handleAcceptBooking } = accept;
  const { rejectBId, setRejectBId, handleRejectBooking, isRejecting } = reject;
  const { setStartB, startB, isStarting, handleStartJob } = start;
  const { reviewData, isReplying, setReviewData, handleReviewReply } = review;
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkerBooking(status);

  const bookings = data?.pages.flatMap(p => p.bookings) ?? [];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="My Jobs" description="Manage your service bookings" />
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
        role={ROLE.WORKER}
        onAccept={id => setAcceptBId(id)}
        onEnRoute={id => markEnRoute(id)}
        onReached={id => markReached(id)}
        onStart={booking => setStartB(booking)}
        onReject={id => setRejectBId(id)}
        onComplete={id => setFinishBId(id)}
        onReqExtra={id => setExtraChargeBId(id)}
        // onCancel={id => reject(id)}
        onReview={data => setReviewData({ id: data.id, reviewId: data.reviewId })}
        detailBasePath="/worker/bookings"
      />
      <WorkerAcceptModal
        isSubmitting={isAccepting}
        onSubmit={handleAcceptBooking}
        open={!!acceptBId}
        bookingId={acceptBId}
        onClose={() => setAcceptBId(null)}
      />
      <WorkerRejectModal
        isSubmitting={isRejecting}
        onSubmit={handleRejectBooking}
        open={!!rejectBId}
        bookingId={rejectBId}
        onClose={() => setRejectBId(null)}
      />
      <WorkerCompleteModal
        isSubmitting={isCompleting}
        onSubmit={handleFinishJob}
        open={!!finishBId}
        bookingId={finishBId}
        onClose={() => setFinishBId(null)}
      />
      <WorkerExtraChargeModal
        isSubmitting={isRequestingExtraCharge}
        onSubmit={handleExtraCharge}
        open={!!extraChargeBId}
        bookingId={extraChargeBId}
        onClose={() => setExtraChargeBId(null)}
      />
      <WorkerStartJobModal
        isSubmitting={isStarting}
        onSubmit={handleStartJob}
        open={!!startB}
        booking={startB}
        onClose={() => setStartB(null)}
      />

      {reviewData?.reviewId && (
        <WorkerReviewReplyModal
          onClose={() => setReviewData(null)}
          onSubmit={handleReviewReply}
          open={!!reviewData}
          reviewId={reviewData?.reviewId}
          isReplying={isReplying}
        />
      )}
    </div>
  );
}
