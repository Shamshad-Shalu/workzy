import AuthLayout from '@/components/molecules/AuthLayout';
import SignupForm from '../components/SignupForm';
import signupImage from '@/assets/auth/signup.jpg';

export default function SignupPage() {
  return (
    <AuthLayout image={signupImage} logo="/logo.png">
      <SignupForm />
    </AuthLayout>
  );
}
