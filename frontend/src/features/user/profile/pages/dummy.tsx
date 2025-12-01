import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  place: string;
  hasLocation: boolean;
  profileImage?: string;
}

interface EditData extends ProfileData {}

const DummyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [otpContext, setOtpContext] = useState<'email' | 'phone' | null>(null);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  // Sample data - in real app this would come from API
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Kishore Junior',
    email: 'kishorejunior@gmail.com',
    phone: '7867876786',
    address: 'Apt 47, Jatwal',
    city: 'Nandivakarna',
    state: 'Kerala',
    pincode: '676326',
    place: 'permthannana',
    hasLocation: true,
    profileImage: undefined, // Add actual image URL here
  });

  const [editData, setEditData] = useState<EditData>({ ...profileData });

  // Calculate profile completion
  const calculateCompletion = (): number => {
    const fields: (keyof ProfileData)[] = [
      'fullName',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
    ];
    const filledFields = fields.filter(
      field => profileData[field] && String(profileData[field]).trim() !== ''
    );
    const locationBonus = profileData.hasLocation ? 1 : 0;
    return Math.round(((filledFields.length + locationBonus) / (fields.length + 1)) * 100);
  };

  const completion = calculateCompletion();

  const handleEdit = (): void => {
    setEditData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleSave = (): void => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof EditData, value: string | boolean): void => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmailOtp = (): void => {
    // API call to send OTP to email
    setOtpContext('email');
    setShowEmailModal(false);
    setShowOtpModal(true);
  };

  const handleSendPhoneOtp = (): void => {
    // API call to send OTP to WhatsApp
    setOtpContext('phone');
    setShowPhoneModal(false);
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (): void => {
    // API call to verify OTP
    if (otpContext === 'email') {
      setProfileData(prev => ({ ...prev, email: newEmail }));
    } else if (otpContext === 'phone') {
      setProfileData(prev => ({ ...prev, phone: newPhone }));
    }
    setShowOtpModal(false);
    setOtp('');
    setNewEmail('');
    setNewPhone('');
    setOtpContext(null);
  };

  const handleChangePassword = (): void => {
    // API call to change password
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 mt-1">Manage your personal information</p>
            </div>
            <div className="flex items-center gap-3">
              {completion < 100 && !isEditing && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Profile Completion</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">{completion}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div
                    onClick={() => setShowImageModal(true)}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profileData.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-100">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  {profileData.fullName || 'Add Your Name'}
                </h2>
                <p className="text-gray-500 mt-1">{profileData.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">Change Email</span>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">
                      {profileData.phone ? 'Change Phone' : 'Add Phone'}
                    </span>
                  </div>
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
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
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Full Name"
                      value={isEditing ? editData.fullName : profileData.fullName}
                      onChange={val => handleInputChange('fullName', val)}
                      isEditing={isEditing}
                      required
                      icon={<User className="w-4 h-4" />}
                    />
                    <InputField
                      label="Phone Number"
                      value={isEditing ? editData.phone : profileData.phone}
                      onChange={val => handleInputChange('phone', val)}
                      isEditing={isEditing}
                      icon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Location Information
                  </h4>

                  <div className="space-y-4">
                    <InputField
                      label="Address"
                      value={isEditing ? editData.address : profileData.address}
                      onChange={val => handleInputChange('address', val)}
                      isEditing={isEditing}
                      placeholder="Street address, apartment, suite"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="City"
                        value={isEditing ? editData.city : profileData.city}
                        onChange={val => handleInputChange('city', val)}
                        isEditing={isEditing}
                      />
                      <InputField
                        label="Place"
                        value={isEditing ? editData.place : profileData.place}
                        onChange={val => handleInputChange('place', val)}
                        isEditing={isEditing}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="State"
                        value={isEditing ? editData.state : profileData.state}
                        onChange={val => handleInputChange('state', val)}
                        isEditing={isEditing}
                      />
                      <InputField
                        label="Pincode"
                        value={isEditing ? editData.pincode : profileData.pincode}
                        onChange={val => handleInputChange('pincode', val)}
                        isEditing={isEditing}
                      />
                    </div>

                    {/* GPS Location Placeholder */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-900 text-sm">GPS Coordinates</h5>
                            {profileData.hasLocation && (
                              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <Check className="w-3 h-3" />
                                Set
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {profileData.hasLocation
                              ? 'Your precise location has been saved for better service delivery.'
                              : 'Set your GPS coordinates for accurate location-based services.'}
                          </p>
                          {isEditing && (
                            <button className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                              {profileData.hasLocation ? 'Update Location' : 'Set Location'} →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Image Modal */}
      {showImageModal && (
        <Modal
          onClose={() => setShowImageModal(false)}
          title="Profile Picture"
          maxWidth="max-w-2xl"
        >
          <div className="flex items-center justify-center">
            <div className="w-96 h-96 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-9xl font-bold">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profileData.fullName?.charAt(0) || 'U'
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)} title="Change Password">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Update Password
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <Modal onClose={() => setShowEmailModal(false)} title="Change Email">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                We'll send a verification code to your new email address.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter new email"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmailOtp}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Send OTP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Change/Add Phone Modal */}
      {showPhoneModal && (
        <Modal
          onClose={() => setShowPhoneModal(false)}
          title={profileData.phone ? 'Change Phone Number' : 'Add Phone Number'}
        >
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <Smartphone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">
                We'll send a verification code to your WhatsApp number.
              </p>
            </div>

            {profileData.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {profileData.phone ? 'New Phone Number' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendPhoneOtp}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Send OTP
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <Modal onClose={() => setShowOtpModal(false)} title="Verify OTP">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                {otpContext === 'email'
                  ? `We've sent a verification code to ${newEmail}`
                  : `We've sent a verification code to your WhatsApp number ${newPhone}`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Resend OTP
            </button>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                  setOtpContext(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Verify
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Input Field Component
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  isEditing,
  required,
  placeholder,
  icon,
}) => {
  const isEmpty = !value || value.trim() === '';

  if (!isEditing) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isEmpty ? (
          <div className="text-gray-400 text-sm italic py-2 flex items-center gap-2">
            {icon && <span className="text-gray-300">{icon}</span>}
            Not provided
          </div>
        ) : (
          <div className="text-gray-900 py-2 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span>{value}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
      />
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, maxWidth = 'max-w-md' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-2xl shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DummyProfile;
