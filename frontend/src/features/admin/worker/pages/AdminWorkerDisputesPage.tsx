import { useOutletContext } from 'react-router-dom';

import { ROLE } from '@/constants';
import { DisputeContent } from '@/features/dispute';
import type { WorkerProfileDetails } from '@/types/worker';

type WorkerOutletContext = { worker: WorkerProfileDetails };

export default function AdminWorkerDisputesPage() {
  const { worker } = useOutletContext<WorkerOutletContext>();

  return <DisputeContent role={ROLE.ADMIN} workerId={worker.id} />;
}
