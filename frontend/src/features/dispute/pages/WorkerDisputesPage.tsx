import { ROLE } from '@/constants';

import { DisputeContent } from '../index';

export default function WorkerDisputesPage() {
  return (
    <main className="p-4 lg:p-6">
      <DisputeContent role={ROLE.WORKER} />
    </main>
  );
}
