import { useState } from 'react';

import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile';
import PageError from '@/pages/PageError';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';

import WorkerProfileLayoutSkeleton from '../components/WorkerProfileLayoutSkeleton';
import { useWorkerProfileImageUpload } from '../hooks/useWorkerProfile';
import WorkerProfileLayout from '../layouts/WorkerProfileLayout';

export default function WorkerProfileRouteWrapper() {
  const [openImage, setOpenImage] = useState(false);
  const { user } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch, error } = useWorkerProfile(user?.worker?.id);

  const { imageUploading, progress, uploadImage } = useWorkerProfileImageUpload();

  async function handleImageUpload(file: File) {
    const url = await uploadImage(file);
    if (url) {
      dispatch(
        updateUser({
          worker: {
            ...(user?.worker ?? {}),
            profileImage: url,
          },
        })
      );
    }
  }
  return (
    <>
      {isLoading ? (
        <WorkerProfileLayoutSkeleton />
      ) : isError || !data ? (
        <PageError fullScreen={false} description={error?.message} onRetry={() => refetch()} />
      ) : (
        <WorkerProfileLayout
          workerInfo={data}
          workerAction={
            <ProfileImage
              src={user?.worker?.profileImage}
              name={data.displayName}
              onClickImage={() => setOpenImage(true)}
              onChange={handleImageUpload}
              loading={imageUploading}
              editable
              progress={progress}
            />
          }
          reloadWorkerData={refetch}
        />
      )}
      <ProfileImageModal open={openImage} onOpenChange={setOpenImage} image={data?.profileImage} />
    </>
  );
}
