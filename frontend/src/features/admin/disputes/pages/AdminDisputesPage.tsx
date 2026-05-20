import { ROLE } from '@/constants';
import DisputePage from '@/features/dispute/page/DisputePage';

export default function AdminDisputesPage() {
  return <DisputePage role={ROLE.ADMIN} />;
}
