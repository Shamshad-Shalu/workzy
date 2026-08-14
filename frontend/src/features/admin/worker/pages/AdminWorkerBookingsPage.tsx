import { useOutletContext } from 'react-router-dom';

import { AdminBookingContent } from '@/features/admin/booking/components/AdminBookingContent';
import type { WorkerProfileDetails } from '@/types/worker';

type WorkerOutletContext = { worker: WorkerProfileDetails };

export default function AdminWorkerBookingsPage() {
  const { worker } = useOutletContext<WorkerOutletContext>();

  return <AdminBookingContent workerId={worker.id} hideHeader />;
}
