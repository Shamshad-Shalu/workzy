import { ROLE } from '@/constants';
import DisputePage from '@/features/dispute/page/DisputePage';

export default function WorkerDisputesPage() {
  return <DisputePage role={ROLE.WORKER} />;
}
