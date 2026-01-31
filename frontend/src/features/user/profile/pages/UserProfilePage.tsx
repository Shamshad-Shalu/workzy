import { Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';

import PageHeader from '@/components/molecules/PageHeader';
import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { Separator } from '@/components/ui/separator';
import AccountChangeActions from '@/features/profile/components/AccountChangeActions';
import ProfileInfoCard from '@/features/profile/components/ProfileInfoCard';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import OtpModal from '@/features/profile/modals/OtpModal';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';

export default function ProfilePage() {
  const { user } = useAppSelector((s: RootState) => s.auth);
  const {
    changeEmail,
    changePhone,
    loading,
    updateBasic,
    getUserProfilePage,
    uploadImage,
    imageLoading,
  } = useProfile();
  const dispatch = useAppDispatch();

  const [openImage, setOpenImage] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{ type: 'email' | 'phone'; value: string } | null>(null);

  function handleOtpRequest(type: 'email' | 'phone', value: string) {
    setOtpData({ type, value });
    setOpenOtpModal(true);
  }

  useEffect(() => {
    async function loadProfile() {
      const res = await getUserProfilePage();
      if (res) {
        dispatch(updateUser(res));
      }
    }
    loadProfile();
  }, [dispatch, getUserProfilePage]);

  if (!user) {
    return null;
  }
  async function handleImageUpload(file: File) {
    const res = await uploadImage(file);
    dispatch(updateUser({ profileImage: res.url }));
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto p-4 lg:text-left md:text-center s:text-center">
        <PageHeader title="My Profile" description="Manage your personal information" />
      </div>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="bg-card rounded-xl border p-6 flex flex-col items-center gap-4">
          <div className="text-center">
            <ProfileImage
              src={user?.profileImage}
              editable
              loading={imageLoading}
              onClickImage={() => setOpenImage(true)}
              onChange={handleImageUpload}
            />
            <h2 className="text-2xl font-bold text-muted-foreground-700 mt-4">{user.name}</h2>
            <p className="text-muted-foreground-500 mt-1">{user.email}</p>
          </div>
          <Separator />
          <AccountChangeActions
            onChangeEmail={() => setOpenEmail(true)}
            onChangePhone={() => setOpenPhone(true)}
            onChangePassword={() => setOpenPass(true)}
          />
        </div>

        <ProfileInfoCard
          user={user}
          onSave={async payload => {
            const data = await updateBasic(payload);
            toast.success(data?.message);
            if (data?.user) {
              dispatch(updateUser(data?.user));
            }
          }}
        />

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
            const { message } = await changeEmail(email);
            toast.success(message);
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
        <ProfileImageModal open={openImage} onOpenChange={setOpenImage} image={user.profileImage} />
        <OtpModal open={openOtpModal} onOpenChange={setOpenOtpModal} otpData={otpData} />
      </div>
    </div>
  );
}
