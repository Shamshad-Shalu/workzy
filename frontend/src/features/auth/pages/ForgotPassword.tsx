import loginImage from '@/assets/auth/login.jpg';
import AuthLayout from '@/layouts/auth/AuthLayout';

import ForgotForm from '../components/ForgotPasswordForm';

import type React from 'react';


const ForgotPassword: React.FC = () => {
  return (
    <AuthLayout image={loginImage} logo="/logo.png">
      <ForgotForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
