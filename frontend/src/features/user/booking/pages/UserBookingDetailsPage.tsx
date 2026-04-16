import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';

import ApproveModal from '../components/bookingActions/ApproveModal';
import CancelModal from '../components/bookingActions/CancelModal';
import { useUserBookingHandler } from '../hooks/useUserBooking';

export default function UserBookingDetailsPage() {
  const { cancel, approve } = useUserBookingHandler();
  const { cancelB, cancelPending, setCancelB, submitCancel } = cancel;
  const { approveBId, approvePending, setApproveBId, submitApprove } = approve;

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.USER}
        handlers={{
          onCancel: booking => setCancelB(booking),
          onApprove: id => setApproveBId(id),
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
    </div>
  );
}
