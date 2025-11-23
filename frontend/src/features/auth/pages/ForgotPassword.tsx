import type React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import ForgotForm from '../components/ForgotPasswordForm';
import loginImage from '@/assets/auth/login.jpg';

const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout image={loginImage} logo="/logo.png">
      <ForgotForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
