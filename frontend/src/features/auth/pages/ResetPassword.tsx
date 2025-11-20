import type React from 'react';
import AuthLayout from '@/components/molecules/AuthLayout';
import ResetPasswordForm from '../components/ResetPasswordForm';
import resetImg from '@/assets/auth/login.jpg';

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout image={resetImg} logo="/logo.png">
      <ResetPasswordForm />
    </AuthLayout>
  );
};
export default ResetPassword;
