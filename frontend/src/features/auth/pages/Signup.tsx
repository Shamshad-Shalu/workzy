import type React from 'react';
import AuthLayout from '@/components/molecules/AuthLayout';
import SignupForm from '../components/SignupForm';
import signupImage from '@/assets/auth/signup.jpg';

const SignupPage: React.FC = () => {
  return (
    <AuthLayout image={signupImage} logo="/logo.png">
      <SignupForm />
    </AuthLayout>
  );
};
export default SignupPage;
