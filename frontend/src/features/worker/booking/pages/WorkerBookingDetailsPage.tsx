import { useState } from 'react';

import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';
import DisputeModal from '@/features/dispute/components/DisputeModal';

import WorkerAcceptModal from '../components/WorkerAcceptModal';
import WorkerCompleteModal from '../components/WorkerCompleteModal';
import WorkerConfirmStatusModal from '../components/WorkerConfirmStatusModal';
import WorkerExtraChargeModal from '../components/WorkerExtraChargeModal';
import WorkerRejectModal from '../components/WorkerRejectModal';
import WorkerStartJobModal from '../components/WorkerStartJobModal';
import { useWorkerBookingHandler } from '../hooks/useWorkerBooking';

export default function WorkerBookingDetailsPage() {
  const [disputeBId, setDisputeBId] = useState<string | null>(null);
  const { accept, start, reject, finish, extraCharge, enRoute, reached } =
    useWorkerBookingHandler();
  const { extraChargeBId, setExtraChargeBId, handleExtraCharge, isRequestingExtraCharge } =
    extraCharge;
  const { setFinishBId, finishBId, isCompleting, handleFinishJob } = finish;
  const { setAcceptBId, acceptBId, isAccepting, handleAcceptBooking } = accept;
  const { rejectBId, setRejectBId, handleRejectBooking, isRejecting } = reject;
  const { setStartB, startB, isStarting, handleStartJob } = start;
  const { enRouteBId, setEnRouteBId, handleMarkEnRoute, isEnRoutePending } = enRoute;
  const { reachedBId, setReachedBId, handleMarkReached, isReachedPending } = reached;

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.WORKER}
        handlers={{
          onAccept: id => accept.setAcceptBId(id),
          onReject: id => reject.setRejectBId(id),
          onEnRoute: id => setEnRouteBId(id),
          onReached: id => setReachedBId(id),
          onDispute: id => setDisputeBId(id),
          onStart: booking => start.setStartB(booking),
        }}
      />
      <WorkerConfirmStatusModal
        open={!!enRouteBId}
        onClose={() => setEnRouteBId(null)}
        onConfirm={async () => {
          if (enRouteBId) {
            await handleMarkEnRoute(enRouteBId);
          }
        }}
        isSubmitting={isEnRoutePending}
        type="en_route"
      />
      <WorkerConfirmStatusModal
        open={!!reachedBId}
        onClose={() => setReachedBId(null)}
        onConfirm={async () => {
          if (reachedBId) {
            await handleMarkReached(reachedBId);
          }
        }}
        isSubmitting={isReachedPending}
        type="reached"
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
      <DisputeModal
        open={!!disputeBId}
        onClose={() => setDisputeBId(null)}
        bookingId={disputeBId}
        role={ROLE.WORKER}
      />
    </div>
  );
}
