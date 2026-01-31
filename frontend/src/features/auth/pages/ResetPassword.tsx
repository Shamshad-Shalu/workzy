import resetImg from '@/assets/auth/login.jpg';
import AuthLayout from '@/layouts/auth/AuthLayout';

import ResetPasswordForm from '../components/ResetPasswordForm';

import type React from 'react';


const ResetPassword: React.FC = () => {
  return (
    <AuthLayout image={resetImg} logo="/logo.png">
      <ResetPasswordForm />
    </AuthLayout>
  );
};
export default ResetPassword;
