import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '../components/LoginForm';
import loginImage from '@/assets/auth/login.jpg';

export default function LoginPage() {
  return (
    <AuthLayout image={loginImage} logo="/logo.png">
      <LoginForm />
    </AuthLayout>
  );
}
