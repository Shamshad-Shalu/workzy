import { useForm } from 'react-hook-form';
import { signupSchema, type SignupSchemaType } from '../validation/signupSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerService } from '@/services/authService';
import { handleApiError } from '@/utils/handleApiError';
import { toast } from 'sonner';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Mail, User } from 'lucide-react';
import PasswordInput from '@/components/atoms/PasswordInput';
import Button from '@/components/atoms/Button';

export default function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      const res = await registerService(data);
      toast.success(res.message);
      navigate('/verify-otp', { state: { email: data.email } });
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold text-gray-900">Create your Workzy account</h1>
      <p className="text-gray-600 mb-5">Let's get started with your registration</p>
      {/* name  */}
      <div>
        <Label>Name</Label>
        <Input
          placeholder="Enter your full name"
          leftIcon={<User />}
          error={errors.name?.message}
          {...register('name')}
        />
      </div>
      {/* email  */}
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
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button type="submit" fullWidth loading={isSubmitting} iconRight={<span>→</span>}>
        Sign Up
      </Button>

      {/* login Link */}
      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <Link className="text-black font-medium hover:underline" to="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
