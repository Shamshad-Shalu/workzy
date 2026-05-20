import { useState } from 'react';

import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';
import DisputeModal from '@/features/dispute/components/DisputeModal';

export default function AdminBookingDetailsPage() {
  const [disputeBId, setDisputeBId] = useState<string | null>(null);

  return (
    <div className="p-4">
      <BookingDetailsPage
        role={ROLE.ADMIN}
        handlers={{
          onDispute: id => setDisputeBId(id),
        }}
      />
      <DisputeModal
        open={!!disputeBId}
        role={ROLE.ADMIN}
        onClose={() => setDisputeBId(null)}
        bookingId={disputeBId}
      />
    </div>
  );
}
