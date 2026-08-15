import { useOutletContext } from 'react-router-dom';

import { AdminReviewsContent } from '@/features/review';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = { user: UserProfileDetails };

export default function AdminUserReviewsPage() {
  const { user } = useOutletContext<UserOutletContext>();

  return <AdminReviewsContent userId={user.id} />;
}
