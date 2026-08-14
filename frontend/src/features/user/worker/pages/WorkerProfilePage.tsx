import { useOutletContext } from 'react-router-dom';

import { WorkerAboutContent } from '@/features/worker/components/WorkerAboutContent';
import type { WorkerProfile } from '@/types/worker';

type WorkerOutletContext = {
  worker: WorkerProfile;
};

export default function WorkerAboutTab() {
  const { worker } = useOutletContext<WorkerOutletContext>();
  const { about, availability, languages } = worker;

  return (
    <WorkerAboutContent
      key={worker.id}
      about={about}
      availability={availability}
      languages={languages}
    />
  );
}
