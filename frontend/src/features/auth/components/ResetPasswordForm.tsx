import React, { useState } from 'react';
import PasswordInput from '@/components/atoms/PasswordInput';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { resetPasswordService } from '@/services/authService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleApiError } from '@/utils/handleApiError';
import PageHeader from '@/components/molecules/PageHeader';
import { ArrowRight } from 'lucide-react';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const email = params.get('email');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      return toast.error('Password is required');
    }
    setLoading(true);
    try {
      const res = await resetPasswordService(email!, token!, password);
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
      <PageHeader title="Reset Password" description="Enter your new password" />

      <div>
        <Label>New Password</Label>
        <PasswordInput
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" iconRight={<ArrowRight />} fullWidth loading={loading}>
        Update Password
      </Button>
    </form>
  );
}
