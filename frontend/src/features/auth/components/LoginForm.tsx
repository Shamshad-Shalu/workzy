import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginSchemaType } from '../validation/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import PasswordInput from '@/components/atoms/PasswordInput';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Mail } from 'lucide-react';
import { AUTH_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/handleApiError';
import Button from '@/components/atoms/Button';
import GoogleIcon from '@/components/icons/GoogleIcon';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold text-gray-900">Welcome Back to Workzy!</h1>
      <p className="text-gray-600 mb-5">Your workspace is just a click away</p>

      {/* Email */}
      <div>
        <Label>Email Address</Label>
        <Input
          placeholder="Enter your email"
          leftIcon={<Mail />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <PasswordInput
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-between items-center mt-2 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link className="text-sm hover:underline text-black" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting}>
        Sign In →
      </Button>

      {/* Signup Link */}
      <p className="text-center text-gray-600">
        Don’t have an account?{' '}
        <Link className="text-black font-medium hover:underline" to="/register">
          Sign up
        </Link>
      </p>

      {/* Divider */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" fullWidth iconLeft={<GoogleIcon />}>
        Sign in with Google
      </Button>
    </form>
  );
}
