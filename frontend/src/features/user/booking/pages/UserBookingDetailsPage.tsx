import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';

import ApproveModal from '../components/bookingActions/ApproveModal';
import CancelModal from '../components/bookingActions/CancelModal';
import ExtraChargeModal from '../components/bookingActions/ExtraChargeModal';
import { useUserBookingHandler } from '../hooks/useUserBooking';

export default function UserBookingDetailsPage() {
  const { cancel, approve, payExtra } = useUserBookingHandler();
  const { cancelB, cancelPending, setCancelB, submitCancel } = cancel;
  const { approveBId, approvePending, setApproveBId, submitApprove } = approve;
  const { payExtraBId, payExtraPending, setPayExtraBId, submitPayExtra } = payExtra;

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.USER}
        handlers={{
          onCancel: booking => setCancelB(booking),
          onApprove: id => setApproveBId(id),
          onPayExtra: id => setPayExtraBId(id),
        }}
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
        bookingId={approveBId}
        onClose={() => setApproveBId(null)}
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
