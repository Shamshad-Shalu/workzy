import { useOutletContext } from 'react-router-dom';

import { AdminPaymentsContent } from '@/features/payments';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = { user: UserProfileDetails };

export default function AdminUserPaymentsPage() {
  const { user } = useOutletContext<UserOutletContext>();

  return <AdminPaymentsContent userId={user.id} />;
}
