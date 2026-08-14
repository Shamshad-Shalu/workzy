import { useOutletContext } from 'react-router-dom';

import { AdminReviewsContent } from '@/features/review';
import type { WorkerProfileDetails } from '@/types/worker';

type WorkerOutletContext = { worker: WorkerProfileDetails };

export default function AdminWorkerReviewsPage() {
  const { worker } = useOutletContext<WorkerOutletContext>();

  return <AdminReviewsContent workerId={worker.id} />;
}
