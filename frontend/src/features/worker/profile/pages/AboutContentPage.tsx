import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';

import ContactChangeModal from '@/features/profile/modals/ContactChangeModal';
import PageError from '@/pages/PageError';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { handleApiError } from '@/utils/handleApiError';

import WorkeAboutSkeleton from '../components/WorkeAboutSkeleton';
import WorkerProfileSection from '../components/WorkerProfileSection';
import {
  useUpdateWorkerProfile,
  useWorkerPhoneChange,
  useWorkerProfileDetails,
} from '../hooks/useWorkerProfile';

import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';

type OutletContext = {
  reloadWorkerData: () => Promise<unknown>;
};

export default function WorkeAboutContentPage() {
  const { reloadWorkerData } = useOutletContext<OutletContext>();
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const { user } = useAppSelector((s: RootState) => s.auth);
  const { data: workerData, isLoading, isError, refetch } = useWorkerProfileDetails();
  const { updateProfile } = useUpdateWorkerProfile();
  const { changePhone, isChangePhone } = useWorkerPhoneChange();

  const handleWorkerProfileSubmit = async (data: WorkerProfileSchemaType): Promise<string> => {
    try {
      const { message } = await updateProfile(data);
      await reloadWorkerData();
      return message;
    } catch (error) {
      toast.error(handleApiError(error));
      return '';
    }
  };
  const handlePhoneChange = async (phone: string) => {
    const { message } = await changePhone(phone);
    toast.success(message);
  };

  return (
    <div>
      {isLoading ? (
        <WorkeAboutSkeleton />
      ) : isError || !workerData ? (
        <PageError fullScreen={false} onRetry={() => refetch()} />
      ) : (
        <WorkerProfileSection
          workerData={workerData}
          onSubmit={handleWorkerProfileSubmit}
          onChangePhone={() => setPhoneModalOpen(true)}
        />
      )}
      <ContactChangeModal
        currentValue={workerData?.phone ?? ''}
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        userEmail={user?.email ?? ''}
        onConfirm={handlePhoneChange}
        isPending={isChangePhone}
      />
    </div>
  );
}
