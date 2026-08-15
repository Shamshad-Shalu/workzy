import { ROLE } from '@/constants';

import { DisputeContent } from '../index';

export default function UserDisputesPage() {
  return (
    <main className="section-container">
      <DisputeContent role={ROLE.USER} />
    </main>
  );
}
