import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginSchemaType } from '../validation/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import PasswordInput from '@/components/atoms/PasswordInput';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Mail } from 'lucide-react';
import { AUTH_MESSAGES, GOOGLE_CALLBACK, SERVER_URL } from '@/constants';
import { handleApiError } from '@/utils/handleApiError';
import Button from '@/components/atoms/Button';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { redirectBasedOnRole } from '@/utils/redirectBasedOnRole';
import { useEffect } from 'react';
import AuthHeader from './atoms/AuthHeader';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginForm() {
  const location = useLocation();
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

  useEffect(() => {
    if (location.state?.blocked) {
      toast.error('Your account has been blocked');
    }
  }, [location.state]);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      redirectBasedOnRole(user.role, navigate);
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };
  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <AuthHeader
        title="Welcome Back to Workzy!"
        description="Your workspace is just a click away"
      />

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
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              className="
              w-5 h-5
              data-[state=checked]:bg-blue-600
              data-[state=checked]:border-blue-600
            "
            />
            Remember me
          </label>
          <Link className="text-sm hover:underline text-muted-foreground" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting}>
        Sign In →
      </Button>

      {/* Signup Link */}
      <p className="text-center text-muted-foreground">
        Don’t have an account?{' '}
        <Link className="text-primary font-medium hover:underline" to="/register">
          Sign up
        </Link>
      </p>

      {/* Divider */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        iconLeft={<GoogleIcon />}
        onClick={() => {
          window.location.href = `${SERVER_URL}/${GOOGLE_CALLBACK}`;
        }}
      >
        Sign in with Google
      </Button>
    </form>
  );
}
