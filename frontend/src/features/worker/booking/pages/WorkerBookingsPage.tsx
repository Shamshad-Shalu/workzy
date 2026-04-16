import { useState } from 'react';

import PageHeader from '@/components/molecules/PageHeader';
import { ROLE, type BookingFilterStatus } from '@/constants';
import { BookingList } from '@/features/booking/components/BookingList';
import { BookingStatusTabs } from '@/features/booking/components/BookingStatusTabs';

import WorkerAcceptModal from '../components/WorkerAcceptModal';
import WorkerCompleteModal from '../components/WorkerCompleteModal';
import WorkerExtraChargeModal from '../components/WorkerExtraChargeModal';
import WorkerRejectModal from '../components/WorkerRejectModal';
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

  const { accept, start, reject, finish, extraCharge } = useWorkerBookingHandler();
  const { extraChargeBId, setExtraChargeBId, requestExtraCharge, isRequestingExtraCharge } =
    extraCharge;
  const { setFinishBId, finishBId, isCompleting, finishJob } = finish;
  const { setAcceptBId, acceptBId, isAccepting, acceptBooking } = accept;
  const { rejectBId, setRejectBId, rejectBooking, isRejecting } = reject;
  const { setStartB, startB, isStarting, startJob } = start;
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
        detailBasePath="/worker/bookings"
      />
      <WorkerAcceptModal
        isSubmitting={isAccepting}
        onSubmit={acceptBooking}
        open={!!acceptBId}
        bookingId={acceptBId}
        onClose={() => setAcceptBId(null)}
      />
      <WorkerRejectModal
        isSubmitting={isRejecting}
        onSubmit={rejectBooking}
        open={!!rejectBId}
        bookingId={rejectBId}
        onClose={() => setRejectBId(null)}
      />
      <WorkerCompleteModal
        isSubmitting={isCompleting}
        onSubmit={finishJob}
        open={!!finishBId}
        bookingId={finishBId}
        onClose={() => setFinishBId(null)}
      />
      <WorkerExtraChargeModal
        isSubmitting={isRequestingExtraCharge}
        onSubmit={requestExtraCharge}
        open={!!extraChargeBId}
        bookingId={extraChargeBId}
        onClose={() => setExtraChargeBId(null)}
      />
      <WorkerStartJobModal
        isSubmitting={isStarting}
        onSubmit={startJob}
        open={!!startB}
        booking={startB}
        onClose={() => setStartB(null)}
      />
    </div>
  );
}
