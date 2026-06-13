import { ROLE } from '@/constants';
import DisputePage from '@/features/dispute/page/DisputePage';

export default function WorkerDisputesPage() {
  return (
    <main className="p-4 lg:p-6">
      <DisputePage role={ROLE.WORKER} />
    </main>
  );
}
