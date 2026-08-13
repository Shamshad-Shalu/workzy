import { useOutletContext } from 'react-router-dom';

import { AdminQuotesContent } from '@/features/quote';
import type { WorkerProfileDetails } from '@/types/worker';

type WorkerOutletContext = { worker: WorkerProfileDetails };

export default function AdminWorkerQuotesPage() {
  const { worker } = useOutletContext<WorkerOutletContext>();

  return <AdminQuotesContent workerId={worker.id} />;
}
