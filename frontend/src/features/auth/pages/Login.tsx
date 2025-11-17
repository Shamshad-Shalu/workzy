import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  const {
    email,
    password,
    showPassword,
    loading,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  } = useAuth();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoginForm
        email={email}
        password={password}
        loading={loading}
        showPassword={showPassword}
        setEmail={setEmail}
        setPassword={setPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
}
