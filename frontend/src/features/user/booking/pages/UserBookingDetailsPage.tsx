import { useState } from 'react';

import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';
import { DisputeModal } from '@/features/dispute';

import ApproveModal from '../components/bookingActions/ApproveModal';
import CancelModal from '../components/bookingActions/CancelModal';
import ExtraChargeModal from '../components/bookingActions/ExtraChargeModal';
import { useUserBookingHandler } from '../hooks/useUserBooking';

export default function UserBookingDetailsPage() {
  const [disputeBId, setDisputeBId] = useState<string | null>(null);
  const { cancel, approve, payExtra } = useUserBookingHandler();
  const { cancelB, handleCancelBooking, setCancelB, isCancelling } = cancel;
  const { approveBId, handleApproveBooking, setApproveBId, isApproving } = approve;
  const { payExtraBId, handlePayExtra, setPayExtraBId, isPayingExtra } = payExtra;

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.USER}
        handlers={{
          onCancel: booking => setCancelB(booking),
          onApprove: id => setApproveBId(id),
          onPayExtra: id => setPayExtraBId(id),
          onDispute: id => setDisputeBId(id),
        }}
      />
      <CancelModal
        open={!!cancelB}
        booking={cancelB}
        onClose={() => setCancelB(null)}
        onSubmit={handleCancelBooking}
        isSubmitting={isCancelling}
      />
      <ApproveModal
        open={!!approveBId}
        bookingId={approveBId}
        onClose={() => setApproveBId(null)}
        onSubmit={handleApproveBooking}
        isSubmitting={isApproving}
      />
      <ExtraChargeModal
        open={!!payExtraBId}
        bookingId={payExtraBId}
        onClose={() => setPayExtraBId(null)}
        onPayAmount={handlePayExtra}
        isSubmitting={isPayingExtra}
      />
      <DisputeModal
        open={!!disputeBId}
        bookingId={disputeBId}
        onClose={() => setDisputeBId(null)}
      />
    </div>
  );
}
