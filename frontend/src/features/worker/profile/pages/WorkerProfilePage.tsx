import ProfileImage from '@/components/molecules/ProfileImage';
import ProfileImageModal from '@/components/molecules/ProfileImageModal';
import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileInfoCard from '@/features/user/profile/components/ProfileInfoCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { Check, Edit2, Lock, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function WorkerProfilePage() {
  const dispatch = useAppDispatch();
  const { uploadImage } = useProfile();
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
    <div className="-mx-4 md:-mx-6 lg:-mx-8 xl:-mx-10 -mt-6 ">
      <WorkerProfileHeader
        workerInfo={workerInfo}
        workerAction={
          <ProfileImage
            src={user.profileImage}
            editable
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
            <ProfileInfoCard user={user} />
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

//           {/* Profile Information Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main Profile Info */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-2xl shadow-sm p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
//                   {!isEditing ? (
//                     <button
//                       onClick={handleEdit}
//                       className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       Edit Profile
//                     </button>
//                   ) : (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={handleCancel}
//                         className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//                       >
//                         <X className="w-4 h-4" />
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSave}
//                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//                       >
//                         <Save className="w-4 h-4" />
//                         Save
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Basic Information */}
//                 <div className="space-y-6">
//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <User className="w-4 h-4 text-indigo-600" />
//                       Basic Information
//                     </h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <InputField
//                         label="Full Name"
//                         value={isEditing ? editData.fullName : profileData.fullName}
//                         onChange={(val) => handleInputChange('fullName', val)}
//                         isEditing={isEditing}
//                         required
//                       />
//                       <InputField
//                         label="Email"
//                         value={isEditing ? editData.email : profileData.email}
//                         onChange={(val) => handleInputChange('email', val)}
//                         isEditing={isEditing}
//                         required
//                       />
//                       <InputField
//                         label="Phone Number"
//                         value={isEditing ? editData.phone : profileData.phone}
//                         onChange={(val) => handleInputChange('phone', val)}
//                         isEditing={isEditing}
//                       />
//                     </div>
//                   </div>

//                   {/* Location Information */}
//                   <div className="pt-6 border-t border-gray-100">
//                     <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-indigo-600" />
//                       Location Information
//                     </h4>

//                     <div className="space-y-4">
//                       <InputField
//                         label="Address"
//                         value={isEditing ? editData.address : profileData.address}
//                         onChange={(val) => handleInputChange('address', val)}
//                         isEditing={isEditing}
//                         placeholder="Street address, apartment, suite"
//                       />

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <InputField
//                           label="City"
//                           value={isEditing ? editData.city : profileData.city}
//                           onChange={(val) => handleInputChange('city', val)}
//                           isEditing={isEditing}
//                         />
//                         <InputField
//                           label="Place"
//                           value={isEditing ? editData.place : profileData.place}
//                           onChange={(val) => handleInputChange('place', val)}
//                           isEditing={isEditing}
//                         />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <InputField
//                           label="State"
//                           value={isEditing ? editData.state : profileData.state}
//                           onChange={(val) => handleInputChange('state', val)}
//                           isEditing={isEditing}
//                         />
//                         <InputField
//                           label="Pincode"
//                           value={isEditing ? editData.pincode : profileData.pincode}
//                           onChange={(val) => handleInputChange('pincode', val)}
//                           isEditing={isEditing}
//                         />
//                       </div>

//                       {/* GPS Location */}
//                       <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
//                         <div className="flex items-start gap-3">
//                           <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <h5 className="font-semibold text-gray-900 text-sm">GPS Coordinates</h5>
//                               {profileData.hasLocation && (
//                                 <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
//                                   <Check className="w-3 h-3" />
//                                   Set
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-sm text-gray-600 mt-1">
//                               {profileData.hasLocation
//                                 ? 'Your precise location has been saved for better service delivery.'
//                                 : 'Set your GPS coordinates for accurate location-based services.'}
//                             </p>
//                             {isEditing && (
//                               <button className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
//                                 {profileData.hasLocation ? 'Update Location' : 'Set Location'} →
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* About Me - Placeholder */}
//               <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
//                 <div className="h-32 bg-gray-100 rounded-lg"></div>
//               </div>

//               {/* Specialties - Placeholder */}
//               <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Specialties</h3>
//                 <div className="h-24 bg-gray-100 rounded-lg"></div>
//               </div>
//             </div>

//             {/* Right Sidebar */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Account Settings Card */}
//               <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => setShowEmailModal(true)}
//                     className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                       <span className="text-sm font-medium text-gray-700">Change Email</span>
//                     </div>
//                     <Edit2 className="w-4 h-4 text-gray-400" />
//                   </button>

//                   <button
//                     onClick={() => setShowPhoneModal(true)}
//                     className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                       <span className="text-sm font-medium text-gray-700">Change Phone</span>
//                     </div>
//                     <Edit2 className="w-4 h-4 text-gray-400" />
//                   </button>

//                   <button
//                     onClick={() => setShowPasswordModal(true)}
//                     className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                       <span className="text-sm font-medium text-gray-700">Change Password</span>
//                     </div>
//                     <Edit2 className="w-4 h-4 text-gray-400" />
//                   </button>
//                 </div>
//               </div>

//               {/* Certifications - Placeholder */}
//               <div className="bg-white rounded-2xl shadow-sm p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
//                 <div className="h-48 bg-gray-100 rounded-lg"></div>
//               </div>
//             </div>
//           </div>
//         {/* </div> */}

//       {/* Modals */}
//       {showImageModal && (
//         <Modal onClose={() => setShowImageModal(false)} title="Profile Picture" maxWidth="max-w-2xl">
//           <div className="flex items-center justify-center">
//             <div className="w-96 h-96 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-9xl font-bold">
//               {profileData.profileImage ? (
//                 <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 profileData.fullName?.charAt(0) || 'U'
//               )}
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showPasswordModal && (
//         <Modal onClose={() => setShowPasswordModal(false)} title="Change Password">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//               <input
//                 type="password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 placeholder="Enter current password"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 placeholder="Enter new password"
//               />
//             </div>
//             <div className="flex gap-2 pt-4">
//               <button onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//                 Cancel
//               </button>
//               <button onClick={handleChangePassword} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
//                 Update Password
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showEmailModal && (
//         <Modal onClose={() => setShowEmailModal(false)} title="Change Email">
//           <div className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-blue-800">We'll send a verification code to your new email address.</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
//               <input type="email" value={profileData.email} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">New Email Address</label>
//               <input
//                 type="email"
//                 value={newEmail}
//                 onChange={(e) => setNewEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 placeholder="Enter new email"
//               />
//             </div>
//             <div className="flex gap-2 pt-4">
//               <button onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//                 Cancel
//               </button>
//               <button onClick={handleSendEmailOtp} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
//                 Send OTP
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showPhoneModal && (
//         <Modal onClose={() => setShowPhoneModal(false)} title="Change Phone Number">
//           <div className="space-y-4">
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
//               <Smartphone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-800">We'll send a verification code to your WhatsApp number.</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Current Phone Number</label>
//               <input type="tel" value={profileData.phone} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">New Phone Number</label>
//               <input
//                 type="tel"
//                 value={newPhone}
//                 onChange={(e) => setNewPhone(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div className="flex gap-2 pt-4">
//               <button onClick={() => setShowPhoneModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//                 Cancel
//               </button>
//               <button onClick={handleSendPhoneOtp} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
//                 Send OTP
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {showOtpModal && (
//         <Modal onClose={() => setShowOtpModal(false)} title="Verify OTP">
//           <div className="space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-blue-800">
//                 {otpContext === 'email'
//                   ? `We've sent a verification code to ${newEmail}`
//                   : `We've sent a verification code to your WhatsApp number ${newPhone}`
//                 }
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 maxLength={6}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
//                 placeholder="000000"
//               />
//             </div>
//             <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Resend OTP</button>
//             <div className="flex gap-2 pt-4">
//               <button
//                 onClick={() => {
//                   setShowOtpModal(false);
//                   setOtp('');
//                   setOtpContext(null);
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleVerifyOtp}
//                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
//               >
//                 Verify
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// // Input Field Component
// interface InputFieldProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   isEditing: boolean;
//   required?: boolean;
//   placeholder?: string;
// }

// const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, isEditing, required, placeholder }) => {
//   const isEmpty = !value || value.trim() === '';

//   if (!isEditing) {
//     return (
//       <div>
//         <label className="block text-xs font-medium text-gray-500 mb-1">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//         {isEmpty ? (
//           <div className="text-gray-400 text-sm italic py-2">
//             Not provided
//           </div>
//         ) : (
//           <div className="text-gray-900 py-2">
//             {value}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <label className="block text-xs font-medium text-gray-700 mb-1">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         type="text"
//         value={value || ''}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
//       />
//     </div>
//   );
// };

// // Modal Component
// interface ModalProps {
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   maxWidth?: string;
// }

// const Modal: React.FC<ModalProps> = ({ onClose, title, children, maxWidth = "max-w-md" }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className={`bg-white rounded-2xl shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
//         <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
//           <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };
