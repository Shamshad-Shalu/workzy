import { useState } from 'react';
import { toast } from 'sonner';

import PageHeader from '@/components/molecules/PageHeader';
import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { Separator } from '@/components/ui/separator';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import ContactChangeModal from '@/features/profile/modals/ContactChangeModal';
import OtpModal from '@/features/profile/modals/OtpModal';
import AccountChangeActions from '@/features/user/profile/components/AccountChangeActions';
import type { ChangePasswordFormType } from '@/features/user/profile/validation/passwordShema';
import type { ProfileFormType } from '@/features/user/profile/validation/profileSchema';
import PageError from '@/pages/PageError';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { handleApiError } from '@/utils/handleApiError';

import ProfileInfoSection from '../components/ProfileInfoSection';
import {
  useUpdateUserProfile,
  useUserProfileImageUpload,
  useUserResendOtp,
  useUserUpdateEmail,
  useUserUpdatePassword,
  useUserUpdatePhone,
  useUserVerifyOtp,
} from '../hooks/useUserProfile';

export default function ProfilePage() {
  const { user } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  const [openImage, setOpenImage] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{ type: 'email' | 'phone'; value: string } | null>(null);
  const { imageUploading, progress, uploadImage } = useUserProfileImageUpload();
  const { updateProfile } = useUpdateUserProfile();
  const { resendOtp, isResending } = useUserResendOtp();
  const { verifyOtp, isVerifying } = useUserVerifyOtp();
  const { updatePhone, isUpdatingPhone } = useUserUpdatePhone();
  const { updateEmail, isUpdatingEmail } = useUserUpdateEmail();
  const { updatePassword } = useUserUpdatePassword();

  const { profileImage, email, name } = user ?? {};

  function handleOtpRequest(type: 'email' | 'phone', value: string) {
    setOtpData({ type, value });
    setOpenOtpModal(true);
  }

  const handleImageUpload = async (file: File) => {
    const url = await uploadImage(file);
    dispatch(updateUser({ profileImage: url }));
  };

  const handleProfileUpdate = async (data: ProfileFormType): Promise<string> => {
    try {
      const { message, user } = await updateProfile(data);
      dispatch(updateUser(user));
      return message;
    } catch (error) {
      toast.error(handleApiError(error));
      return '';
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!otpData) {
      return;
    }

    const res = await verifyOtp({
      type: otpData.type,
      contact: otpData.value,
      otp,
    });
    dispatch(updateUser(res.user));
    toast.success(res.message);
  };

  const handleResendOtp = async () => {
    if (!otpData) {
      return;
    }
    const res = await resendOtp({
      type: otpData.type,
      value: otpData.value,
    });

    toast.success(res.message);
  };

  const handleUpdatePassword = async (data: ChangePasswordFormType) => {
    const { message } = await updatePassword(data);
    toast.success(message);
    return message;
  };

  if (!user) {
    return <PageError />;
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
              src={profileImage}
              name={name}
              editable
              loading={imageUploading}
              progress={progress}
              onClickImage={() => setOpenImage(true)}
              onChange={handleImageUpload}
            />
            <h2 className="text-2xl font-bold text-muted-foreground-700 mt-4">{name}</h2>
            <p className="text-muted-foreground-500 mt-1">{email}</p>
          </div>
          <Separator />
          <AccountChangeActions
            onChangeEmail={() => setOpenEmail(true)}
            onChangePhone={() => setOpenPhone(true)}
            onChangePassword={() => setOpenPass(true)}
          />
        </div>

        <ProfileInfoSection user={user} onSubmit={handleProfileUpdate} />
        <ContactChangeModal
          open={openEmail}
          onClose={() => setOpenEmail(false)}
          currentValue={user.email ?? ''}
          userEmail={user?.email ?? ''}
          onConfirm={async (email: string) => {
            const { message } = await updateEmail(email);
            toast.success(message);
            handleOtpRequest('email', email);
          }}
          isPending={isUpdatingEmail}
          type="email"
        />
        <ContactChangeModal
          open={openPhone}
          onClose={() => setOpenPhone(false)}
          currentValue={user.phone ?? ''}
          userEmail={user?.email ?? ''}
          onConfirm={async (phone: string) => {
            const { message } = await updatePhone(phone);
            toast.success(message);
            handleOtpRequest('phone', phone);
          }}
          isPending={isUpdatingPhone}
        />
        <OtpModal
          open={openOtpModal}
          onOpenChange={setOpenOtpModal}
          // otpData={otpData}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          loading={isResending || isVerifying}
        />
        <ChangePasswordModal
          open={openPass}
          onOpenChange={setOpenPass}
          onConfirm={handleUpdatePassword}
        />
        <ProfileImageModal open={openImage} onOpenChange={setOpenImage} image={user.profileImage} />
      </div>
    </div>
  );
}
