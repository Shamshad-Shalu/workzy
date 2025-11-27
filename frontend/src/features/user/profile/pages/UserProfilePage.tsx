import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import ProfileInfoCard from '../components/ProfileInfoCard';
import UserProfileCard from '../components/UserProfileCard';
import PageHeader from '@/components/molecules/PageHeader';
import Header from '@/layouts/user/Header';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import { profileApi } from '@/features/profile/api/profile.api';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import { Mail, Phone } from 'lucide-react';
import z from 'zod';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';

export default function ProfilePage() {
  const { user } = useAppSelector(s => s.auth);

  const [openImage, setOpenImage] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);

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

        <ProfileInfoCard user={user} onEdit={() => {}} />

        {/* email  */}
        <ChangeFieldModal
          open={openEmail}
          onOpenChange={setOpenEmail}
          title="Change Email"
          label="New Email"
          schema={z.object({ value: emailRule })}
          leftIcon={<Mail size={18} />}
          description="We'll send a verification code to your new email address."
          placeholder="Enter new email"
          initialValue={user.email}
          onSubmit={async email => {
            await profileApi.requestChangeEmail(email);
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
          schema={z.object({ value: phoneRule })}
          initialValue={user.phone}
          onSubmit={async phone => {
            await profileApi.requestChangePhone(phone);
          }}
        />
        <ChangePasswordModal open={openPass} onOpenChange={setOpenPass} />
        <ProfileImageModal
          open={openImage}
          onOpenChange={setOpenImage}
          image={
            user.profileImage ||
            'https://res.cloudinary.com/dhvlhpg55/image/upload/v1740028408/nexus/images/oamn3bzchpmixago65yf.jpg'
          }
        />
      </div>
    </div>
  );
}
