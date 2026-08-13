import { ROLE } from '@/constants';

import { DisputeContent } from '../index';

export default function AdminDisputesPage() {
  return (
    <main className="p-4 lg:p-6">
      <DisputeContent role={ROLE.ADMIN} />
    </main>
  );
}
