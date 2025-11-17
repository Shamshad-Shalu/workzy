import type React from 'react';
import AuthLayout from '@/components/molecules/AuthLayout';
import OtpForm from '../components/OtpForm';
import otpImage from '@/assets/auth/otp.jpeg';

const OtpPage: React.FC = () => {
  return (
    <AuthLayout image={otpImage} logo="/logo.png">
      <OtpForm />
    </AuthLayout>
  );
};

export default OtpPage;
