import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';

import WorkerAcceptModal from '../components/WorkerAcceptModal';
import WorkerCompleteModal from '../components/WorkerCompleteModal';
import WorkerExtraChargeModal from '../components/WorkerExtraChargeModal';
import WorkerRejectModal from '../components/WorkerRejectModal';
import WorkerStartJobModal from '../components/WorkerStartJobModal';
import { useMarkEnRoute, useMarkReached, useWorkerBookingHandler } from '../hooks/useWorkerBooking';

export default function WorkerBookingDetailsPage() {
  const { mutateAsync: markEnRoute } = useMarkEnRoute();
  const { mutateAsync: markReached } = useMarkReached();

  const { accept, start, reject, finish, extraCharge } = useWorkerBookingHandler();
  const { extraChargeBId, setExtraChargeBId, requestExtraCharge, isRequestingExtraCharge } =
    extraCharge;
  const { setFinishBId, finishBId, isCompleting, finishJob } = finish;
  const { setAcceptBId, acceptBId, isAccepting, acceptBooking } = accept;
  const { rejectBId, setRejectBId, rejectBooking, isRejecting } = reject;
  const { setStartB, startB, isStarting, startJob } = start;

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.WORKER}
        handlers={{
          onAccept: id => accept.setAcceptBId(id),
          onReject: id => accept.setAcceptBId(id),
          onEnRoute: id => markEnRoute(id),
          onReached: id => markReached(id),
          onStart: booking => start.setStartB(booking),
        }}
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
