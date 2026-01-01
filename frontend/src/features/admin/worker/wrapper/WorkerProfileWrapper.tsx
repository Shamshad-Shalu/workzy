import ProfileImage from '@/components/molecules/ProfileImage';
import { useEffect, useState } from 'react';
import type { WorkerInfo } from '@/types/worker';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { useWorkerProfile } from '@/features/worker/profile/hooks/useWorkerProfile';
import type { StatItem } from '@/features/worker/profile/layouts/WorkerProfileLayout';
import WorkerProfileLayoutSkeleton from '@/features/worker/profile/components/WorkerProfileSkeleton';
import WorkerProfileLayout from '@/features/worker/profile/layouts/WorkerProfileLayout';

export default function WorkerProfileRouteWrapper() {
  const { getWorkerSummary } = useWorkerProfile();

  const [openImage, setOpenImage] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [workerStats, setWorkerStats] = useState<StatItem[]>([]);

  async function load() {
    const { workerInfo, workerStats } = await getWorkerSummary();
    setWorkerInfo(workerInfo);
    setWorkerStats([
      { value: workerStats.jobsCompleted.toString() || '0', label: 'Jobs Completed' },
      { value: workerStats.averageRating.toString() || 'N/A', label: 'Average Rating' },
      { value: workerStats.completionRate.toString() || '0%', label: 'Completion Rate' },
    ]);
  }
  function reloadWorkerData() {
    load();
  }
  useEffect(() => {
    load();
  }, [load]);

  if (!workerInfo) {
    return <WorkerProfileLayoutSkeleton />;
  }

  return (
    <>
      <WorkerProfileLayout
        workerInfo={workerInfo}
        workerStats={workerStats}
        workerAction={<ProfileImage src={workerInfo?.profileImage} editable={false} />}
        reloadWorkerData={reloadWorkerData}
      />
      <ProfileImageModal
        open={openImage}
        onOpenChange={setOpenImage}
        image={workerInfo.profileImage}
      />
    </>
  );
}
