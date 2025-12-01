import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  Check,
  AlertCircle,
  Smartphone,
  Star,
  TrendingUp,
  CheckCircle,
  Award,
  Clock,
} from 'lucide-react';

interface WorkerProfileData {
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
  profession: string;
  location: string;
  experience: string;
  responseTime: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  availability: 'Available' | 'Busy' | 'Offline';
  jobsCompleted: number;
  completionRate: number;
}

const DummyWorkerProfilePage: React.FC = () => {
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

  const [profileData, setProfileData] = useState<WorkerProfileData>({
    fullName: 'Mike Johnson',
    email: 'mike.johnson@gmail.com',
    phone: '7510923889',
    address: 'Apt 47, Jatwal',
    city: 'Jubele',
    state: 'Kerala',
    pincode: '676326',
    place: 'Calicut',
    hasLocation: true,
    profileImage: undefined,
    profession: 'Professional Plumber',
    location: 'Jubele, Calicut, Kerala',
    experience: '15+ Years Experience',
    responseTime: '< 1 Hour response',
    rating: 4.9,
    reviewsCount: 127,
    hourlyRate: 150,
    availability: 'Available',
    jobsCompleted: 450,
    completionRate: 98,
  });

  const [editData, setEditData] = useState<WorkerProfileData>({ ...profileData });

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

  const handleInputChange = (field: keyof WorkerProfileData, value: string | boolean): void => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmailOtp = (): void => {
    setOtpContext('email');
    setShowEmailModal(false);
    setShowOtpModal(true);
  };

  const handleSendPhoneOtp = (): void => {
    setOtpContext('phone');
    setShowPhoneModal(false);
    setShowOtpModal(true);
  };

  const handleVerifyOtp = (): void => {
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
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="bg-gradient-to-br ">
      {/* <div className="flex-1 "> */}
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left Side - Profile Info */}
          <div className="flex gap-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div
                onClick={() => setShowImageModal(true)}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
              >
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
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-100">
                <Camera className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Name and Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profileData.fullName}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-4">{profileData.profession}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{profileData.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{profileData.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rating and Price */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">{profileData.rating}</span>
              <span className="text-gray-500">({profileData.reviewsCount} reviews)</span>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">₹{profileData.hourlyRate}</div>
              <div className="text-gray-500">per hour</div>
              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                  profileData.availability === 'Available'
                    ? 'bg-green-100 text-green-700'
                    : profileData.availability === 'Busy'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {profileData.availability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{profileData.jobsCompleted}</div>
          <div className="text-gray-500 text-sm">Jobs Completed</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{profileData.rating}/5</div>
          <div className="text-gray-500 text-sm">Average Rating</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-1">{profileData.completionRate}%</div>
          <div className="text-gray-500 text-sm">Completion Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-8">
            <button className="py-4 border-b-2 border-indigo-600 text-indigo-600 font-semibold">
              About
            </button>
            <button className="py-4 border-b-2 border-transparent text-gray-500 font-semibold hover:text-gray-700">
              Skills & Services
            </button>
            <button className="py-4 border-b-2 border-transparent text-gray-500 font-semibold hover:text-gray-700">
              Documents & Verification
            </button>
            <button className="py-4 border-b-2 border-transparent text-gray-500 font-semibold hover:text-gray-700">
              Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
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
                    Save
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
                  />
                  <InputField
                    label="Email"
                    value={isEditing ? editData.email : profileData.email}
                    onChange={val => handleInputChange('email', val)}
                    isEditing={isEditing}
                    required
                  />
                  <InputField
                    label="Phone Number"
                    value={isEditing ? editData.phone : profileData.phone}
                    onChange={val => handleInputChange('phone', val)}
                    isEditing={isEditing}
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

                  {/* GPS Location */}
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

          {/* About Me - Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>

          {/* Specialties - Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specialties</h3>
            <div className="h-24 bg-gray-100 rounded-lg"></div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
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
                  <span className="text-sm font-medium text-gray-700">Change Phone</span>
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

          {/* Certifications - Placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
            <div className="h-48 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Modals */}
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

      {showPhoneModal && (
        <Modal onClose={() => setShowPhoneModal(false)} title="Change Phone Number">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <Smartphone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">
                We'll send a verification code to your WhatsApp number.
              </p>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Phone Number
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

// Input Field Component
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  required?: boolean;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  isEditing,
  required,
  placeholder,
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
          <div className="text-gray-400 text-sm italic py-2">Not provided</div>
        ) : (
          <div className="text-gray-900 py-2">{value}</div>
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

// Modal Component
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

export default DummyWorkerProfilePage;
