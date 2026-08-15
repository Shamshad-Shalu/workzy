import { useOutletContext } from 'react-router-dom';

import { AdminBookingContent } from '@/features/admin/booking/components/AdminBookingContent';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = { user: UserProfileDetails };

export default function AdminUserBookingsPage() {
  const { user } = useOutletContext<UserOutletContext>();

  return <AdminBookingContent userId={user.id} hideHeader />;
}
