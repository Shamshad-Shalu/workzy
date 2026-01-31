import { useCallback, useEffect, useState } from 'react';

import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { WorkerInfo } from '@/types/worker';

import WorkerProfileLayoutSkeleton from '../components/WorkerProfileSkeleton';
import { useWorkerProfile } from '../hooks/useWorkerProfile';
import WorkerProfileLayout, { type StatItem } from '../layouts/WorkerProfileLayout';

export default function WorkerProfileRouteWrapper() {
  const dispatch = useAppDispatch();
  const { uploadImage, imageLoading } = useProfile();
  const { getWorkerSummary } = useWorkerProfile();

  const [openImage, setOpenImage] = useState(false);
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [workerStats, setWorkerStats] = useState<StatItem[]>([]);

  const load = useCallback(async () => {
    const { workerInfo, workerStats } = await getWorkerSummary();
    setWorkerInfo(workerInfo);
    setWorkerStats([
      { value: workerStats.jobsCompleted.toString() || '0', label: 'Jobs Completed' },
      { value: workerStats.averageRating.toString() || 'N/A', label: 'Average Rating' },
      { value: workerStats.completionRate.toString() || '0%', label: 'Completion Rate' },
    ]);
  }, [getWorkerSummary]);

  useEffect(() => {
    load();
  }, [load]);

  if (!workerInfo) {
    return <WorkerProfileLayoutSkeleton />;
  }
  async function handleImageUpload(file: File) {
    const res = await uploadImage(file);
    dispatch(updateUser({ profileImage: res.url }));
    load();
  }

  return (
    <>
      <WorkerProfileLayout
        workerInfo={workerInfo}
        workerStats={workerStats}
        workerAction={
          <ProfileImage
            src={workerInfo?.profileImage}
            editable
            loading={imageLoading}
            onClickImage={() => setOpenImage(true)}
            onChange={handleImageUpload}
          />
        }
        reloadWorkerData={() => load()}
      />
      <ProfileImageModal
        open={openImage}
        onOpenChange={setOpenImage}
        image={workerInfo.profileImage}
      />
    </>
  );
}
