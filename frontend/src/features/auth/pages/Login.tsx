import loginImage from '@/assets/auth/login.jpg';
import AuthLayout from '@/layouts/auth/AuthLayout';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout image={loginImage} logo="/logo.png">
      <LoginForm />
    </AuthLayout>
  );
}
