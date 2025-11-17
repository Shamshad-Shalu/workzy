import React, { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { Mail } from 'lucide-react';
import { forgotPasswordService } from '@/services/authService';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error('Email is required');
    }

    setLoading(true);
    try {
      const res = await forgotPasswordService(email);
      toast.success(res.message);
      navigate('/login');
    } catch (err: any) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p className="text-gray-600">Enter your email to reset your password</p>

      <div>
        <Label>Email Address</Label>
        <Input
          placeholder="Enter your email"
          leftIcon={<Mail />}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Send Reset Link →
      </Button>
    </form>
  );
}
