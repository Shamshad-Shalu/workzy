import ProfileImage from '@/components/molecules/ProfileImage';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';
import WorkerProfileLayout, { type StatItem } from '../layouts/WorkerProfileLayout';
import { useWorkerProfile } from '../hooks/useWorkerProfile';
import type { WorkerInfo } from '@/types/worker';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import WorkerProfileLayoutSkeleton from '../components/WorkerProfileSkeleton';

export default function WorkerProfileRouteWrapper() {
  const dispatch = useAppDispatch();
  const { uploadImage, imageLoading } = useProfile();
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
  useEffect(() => {
    load();
  }, []);

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
      />
      <ProfileImageModal
        open={openImage}
        onOpenChange={setOpenImage}
        image={workerInfo.profileImage}
      />
    </>
  );
}
