import { ROLE } from '@/constants';
import DisputePage from '@/features/dispute/page/DisputePage';

export default function UserDisputesPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 ">
      <DisputePage role={ROLE.USER} />;
    </div>
  );
}
