import ProfileInfoCard from '@/features/profile/components/ProfileInfoCard';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ChangeFieldModal from '@/features/profile/modals/ChangeFieldModal';
import ChangePasswordModal from '@/features/profile/modals/ChangePasswordModal';
import OtpModal from '@/features/profile/modals/OtpModal';
import { emailRule, phoneRule } from '@/lib/validation/rules';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Lock, Mail, Pencil, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import WorkerSection from '../components/WorkerSection';
import type { WorkerProfile } from '@/types/worker';

export default function WorkeAboutContentPage() {
  const [openEmail, setOpenEmail] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otpData, setOtpData] = useState<{ type: 'email' | 'phone'; value: string } | null>(null);

  const { user } = useAppSelector((s: any) => s.auth);
  const { changeEmail, changePhone, loading, updateBasic } = useProfile();
  const dispatch = useAppDispatch();

  if (!user) {
    return null;
  }

  const [dummyData] = useState<WorkerProfile>({
    displayName: 'John Doe',
    tagline: 'Experienced Plumber',
    about: 'I have over 10 years...',
    coverImage: '',
    defaultRate: { amount: 250, type: 'fixed' },

    skills: ['Pipe Installation', 'Leak Repairs', 'Maintenance Services'],

    cities: ['New York', 'Los Angeles'],

    availability: {
      monday: [
        { startTime: '09:00', endTime: '13:00' },
        { startTime: '15:00', endTime: '18:00' },
      ],
      tuesday: [{ startTime: '10:00', endTime: '16:00' }],
      wednesday: [],
      thursday: [{ startTime: '09:00', endTime: '12:00' }],
      friday: [{ startTime: '09:00', endTime: '17:00' }],
      saturday: [],
      sunday: [],
    },
  });

  function handleOtpRequest(type: 'email' | 'phone', value: string) {
    setOtpData({ type, value });
    setOpenOtpModal(true);
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
        </div>
      </div>
      <WorkerSection workerData={dummyData} />
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
