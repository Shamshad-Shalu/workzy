import { ROLE } from '@/constants';
import BookingDetailsPage from '@/features/booking/page/Bookingdetailspage';

export default function AdminBookingDetailsPage() {
  const onApprove = (id: string) => {
    console.log('id:', id);
  };
  return (
    <div className="p-4">
      <BookingDetailsPage role={ROLE.ADMIN} handlers={{ onApprove }} />
    </div>
  );
}
