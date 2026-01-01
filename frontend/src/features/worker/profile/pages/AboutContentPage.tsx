import ProfileInfoCard from '@/features/profile/components/ProfileInfoCard';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import OtpModal from '@/features/profile/modals/OtpModal';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import WorkerSection from '../components/WorkerSection';
import type { WorkerProfile } from '@/types/worker';
import { useWorkerProfile } from '../hooks/useWorkerProfile';
import AccountChangeActions from '@/features/profile/components/AccountChangeActions';
import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';
import { handleApiError } from '@/utils/handleApiError';
import { useOutletContext } from 'react-router-dom';

type OutletContext = {
  reloadWorkerData: () => Promise<void>;
};

export default function WorkeAboutContentPage() {
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{ type: 'email' | 'phone'; value: string } | null>(null);
  const [workerInfo, setWorkerInfo] = useState<WorkerProfile | null>(null);

  const { user } = useAppSelector((s: any) => s.auth);
  const { reloadWorkerData } = useOutletContext<OutletContext>();
  const { changeEmail, changePhone, loading, updateBasic, getUserProfilePage } = useProfile();
  const { getWorkerProfile, updateWorkerProfile } = useWorkerProfile();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadProfile() {
      const [userInfo, workerInfo] = await Promise.all([getUserProfilePage(), getWorkerProfile()]);
      if (userInfo) {
        dispatch(updateUser(userInfo));
      }
      if (workerInfo) {
        setWorkerInfo(workerInfo);
      }
    }
    loadProfile();
  }, []);

  if (!user) {
    return null;
  }
  function handleOtpRequest(type: 'email' | 'phone', value: string) {
    setOtpData({ type, value });
    setOpenOtpModal(true);
  }

  async function handleWorkerProfileSubmit(data: WorkerProfileSchemaType) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'coverImage') {
        if (value instanceof File) {
          formData.append('coverImage', value);
        }
        return;
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });

    try {
      await updateWorkerProfile(formData);
      reloadWorkerData();
      toast.success('successfully updated worker profile');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="lg:col-span-2">
          <ProfileInfoCard
            user={user}
            onSave={async payload => {
              const res = await updateBasic(payload);
              dispatch(updateUser(res?.user));
              toast.success(res.message);
            }}
          />
        </div>
        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-primary mb-4">Account Settings</h3>
            <AccountChangeActions
              onChangeEmail={() => setOpenEmail(true)}
              onChangePhone={() => setOpenPhone(true)}
              onChangePassword={() => setOpenPass(true)}
            />
          </div>
        </div>
      </div>

      {workerInfo && <WorkerSection workerData={workerInfo} onSubmit={handleWorkerProfileSubmit} />}

      {/* email  */}
      <ChangeFieldModal
        open={openEmail}
        onOpenChange={setOpenEmail}
        title="Change Email"
        label="New Email"
        loading={loading}
        schema={z.object({ value: emailRule })}
        leftIcon={<Mail size={18} />}
        description="We'll send a verification code to your new email address."
        placeholder="Enter new email"
        initialValue={user.email}
        onSubmit={async email => {
          const res = await changeEmail(email);
          console.log('res', res);
          toast.success(res.message);
          handleOtpRequest('email', email);
        }}
      />

      <ChangeFieldModal
        open={openPhone}
        onOpenChange={setOpenPhone}
        title="Change Phone"
        label="New Phone Number"
        leftIcon={<Phone size={18} />}
        description="We'll send a verification code to your WhatsApp number."
        placeholder="Enter phone number"
        loading={loading}
        schema={z.object({ value: phoneRule })}
        initialValue={user.phone}
        onSubmit={async phone => {
          const res = await changePhone(phone);
          toast.success(res.message);
          handleOtpRequest('phone', phone);
        }}
      />
      <ChangePasswordModal open={openPass} onOpenChange={setOpenPass} />
      <OtpModal open={openOtpModal} onOpenChange={setOpenOtpModal} otpData={otpData} />
    </div>
  );
}
