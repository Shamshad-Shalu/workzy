import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import ProfileInfoCard from '../components/ProfileInfoCard';
import UserProfileCard from '../components/UserProfileCard';
import PageHeader from '@/components/molecules/PageHeader';
import Header from '@/layouts/user/Header';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import { Mail, Phone } from 'lucide-react';
import z from 'zod';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { toast } from 'sonner';
import OtpModal from '@/features/profile/modals/OtpModal';

export default function ProfilePage() {
  const { user } = useAppSelector((s: any) => s.auth);
  const { changeEmail, changePhone, loading } = useProfile();

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

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-4 lg:text-left md:text-center s:text-center">
        <PageHeader title="My Profile" description="Manage your personal information" />
      </div>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <UserProfileCard
          user={user}
          onChangeEmail={() => setOpenEmail(true)}
          onChangePhone={() => setOpenPhone(true)}
          onChangePassword={() => setOpenPass(true)}
          onChangeImage={() => setOpenImage(true)}
        />

        <ProfileInfoCard user={user} />

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
        <ProfileImageModal open={openImage} onOpenChange={setOpenImage} image={user.profileImage} />
        <OtpModal open={openOtpModal} onOpenChange={setOpenOtpModal} otpData={otpData} />
      </div>
    </div>
  );
}
