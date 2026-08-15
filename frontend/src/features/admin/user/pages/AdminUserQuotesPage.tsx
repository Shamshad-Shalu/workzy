import { useOutletContext } from 'react-router-dom';

import { AdminQuotesContent } from '@/features/quote';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = { user: UserProfileDetails };

export default function AdminUserQuotesPage() {
  const { user } = useOutletContext<UserOutletContext>();

  return <AdminQuotesContent userId={user.id} />;
}
