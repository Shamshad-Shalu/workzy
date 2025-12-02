import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileInfoCard from '@/features/profile/components/ProfileInfoCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Check, Lock, Mail, Pencil, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import z from 'zod';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import OtpModal from '@/features/profile/modals/OtpModal';

export default function WorkerProfilePage() {
  const dispatch = useAppDispatch();
  const { uploadImage, loading, updateBasic, getUserProfilePage, changeEmail, changePhone } =
    useProfile();
  const [openImage, setOpenImage] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{ type: 'email' | 'phone'; value: string } | null>(null);
  const { user } = useAppSelector(s => s.auth);

  useEffect(() => {
    async function loadProfile() {
      const res = await getUserProfilePage();
      if (res) {
        dispatch(updateUser(res));
      }
    }
    loadProfile();
  }, []);

  if (!user) {
    return;
  }

  function handleOtpRequest(type: 'email' | 'phone', value: string) {
    setOtpData({ type, value });
    setOpenOtpModal(true);
  }

  async function handleImageUpload(file: any) {
    const res = await uploadImage(file);
    dispatch(updateUser({ profileImage: res.url }));
  }

  const workerInfo = {
    displayName: user.name,
    profileImage: user.profileImage,
  };

  return (
    <div className="-mx-4 md:-mx-6 lg:-mx-8 xl:-mx-10 -my-6 pb-12 bg-background">
      <WorkerProfileHeader
        workerInfo={workerInfo}
        workerAction={
          <ProfileImage
            src={user.profileImage}
            editable
            loading={loading}
            onClickImage={() => setOpenImage(true)}
            onChange={handleImageUpload}
          />
        }
      />
      <div className="px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-7 ">
          <StatCard icon={<Check className="w-6 h-6" />} value="450" label="Jobs Completed" />
          <StatCard icon={<Check className="w-6 h-6" />} value="450" label="Jobs Completed" />
          <StatCard icon={<Check className="w-6 h-6" />} value="450" label="Jobs Completed" />
        </div>
        {/* Tabs */}
        <div className="bg-card rounded-2xl shadow-sm mb-6">
          <div className="bg-card p-4 text-bg text-muted-foreground ">About</div>
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="w-full space-y-3">
                <button
                  onClick={() => setOpenEmail(true)}
                  className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={18} /> Change Email
                  </span>
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setOpenPhone(true)}
                  className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Phone size={18} /> Change Phone
                  </span>
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setOpenPass(true)}
                  className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Lock size={18} /> Change Password
                  </span>
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
              <div className="h-48 bg-gray-100 rounded-lg"></div>
            </div> */}
          </div>
        </div>
      </div>

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
      <ProfileImageModal open={openImage} image={user.profileImage} onOpenChange={setOpenImage} />
    </div>
  );
}
