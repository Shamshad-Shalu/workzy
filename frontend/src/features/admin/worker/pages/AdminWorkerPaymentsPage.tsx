import { useOutletContext } from 'react-router-dom';

import { AdminPaymentsContent } from '@/features/payments';
import type { WorkerProfileDetails } from '@/types/worker';

type WorkerOutletContext = { worker: WorkerProfileDetails };

export default function AdminWorkerPaymentsPage() {
  const { worker } = useOutletContext<WorkerOutletContext>();

  return <AdminPaymentsContent workerId={worker.id} />;
}
