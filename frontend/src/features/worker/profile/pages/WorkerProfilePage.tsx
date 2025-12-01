import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileInfoCard from '@/features/profile/components/ProfileInfoCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Check, Edit2, Lock, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function WorkerProfilePage() {
  const dispatch = useAppDispatch();
  const { uploadImage, loading, updateBasic } = useProfile();
  const [openImage, setOpenImage] = useState<boolean>(false);
  const { user } = useAppSelector(s => s.auth);

  if (!user) {
    return;
  }

  const workerInfo = {
    displayName: user.name,
    profileImage: user.profileImage,
  };

  async function handleImageUpload(file: any) {
    const res = await uploadImage(file);
    dispatch(updateUser({ profileImage: res.url }));
  }

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
            {/* Account Settings Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-3">
                <button
                  // onClick={() => setShowEmailModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">Change Email</span>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  // onClick={() => setShowPhoneModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">Change Phone</span>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  // onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">Change Password</span>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Certifications - Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
              <div className="h-48 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <ProfileImageModal open={openImage} image={user.profileImage} onOpenChange={setOpenImage} />
    </div>
  );
}
