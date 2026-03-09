import { useState } from 'react';

import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';

import WorkerProfileLayoutSkeleton from '../components/WorkerProfileSkeleton';
import { useWorkerProfile } from '../hooks/useWorkerProfile';
import WorkerProfileLayout from '../layouts/WorkerProfileLayout';

export default function WorkerProfileRouteWrapper() {
  const dispatch = useAppDispatch();
  const { uploadImage, imageLoading } = useProfile();
  const { summaryQuery, reload } = useWorkerProfile();
  const { data: workerInfo, isLoading, isError } = summaryQuery;

  const [openImage, setOpenImage] = useState(false);

  async function handleImageUpload(file: File) {
    const res = await uploadImage(file);
    dispatch(updateUser({ profileImage: res.url }));
    reload();
  }
  if (isLoading) {
    return <WorkerProfileLayoutSkeleton />;
  }
  if (isError || !workerInfo) {
    return <div>Error loading worker profile.</div>;
  }
  return (
    <>
      <WorkerProfileLayout
        workerInfo={workerInfo}
        workerAction={
          <ProfileImage
            src={workerInfo.profileImage}
            editable
            loading={imageLoading}
            onClickImage={() => setOpenImage(true)}
            onChange={handleImageUpload}
          />
        }
        reloadWorkerData={reload}
      />
      <ProfileImageModal
        open={openImage}
        onOpenChange={setOpenImage}
        image={workerInfo.profileImage}
      />
    </>
  );
}
