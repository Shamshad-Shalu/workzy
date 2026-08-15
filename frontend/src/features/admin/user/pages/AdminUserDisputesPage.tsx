import { useOutletContext } from 'react-router-dom';

import { ROLE } from '@/constants';
import { DisputeContent } from '@/features/dispute';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = { user: UserProfileDetails };

export default function AdminUserDisputesPage() {
  const { user } = useOutletContext<UserOutletContext>();

  return (
    <div className="pt-4">
      <DisputeContent role={ROLE.ADMIN} userId={user.id} />
    </div>
  );
}
