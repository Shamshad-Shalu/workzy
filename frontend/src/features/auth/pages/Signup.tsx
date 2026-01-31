import signupImage from '@/assets/auth/signup.jpg';
import AuthLayout from '@/layouts/auth/AuthLayout';

import SignupForm from '../components/SignupForm';

import type React from 'react';


const SignupPage: React.FC = () => {
  return (
    <AuthLayout image={signupImage} logo="/logo.png">
      <SignupForm />
    </AuthLayout>
  );
};
export default SignupPage;
