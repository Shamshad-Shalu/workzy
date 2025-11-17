import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/store/store';
import { loginService } from '@/services/authService';
import { handleApiError } from '@/utils/handleApiError';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await loginService(email, password);

      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
        })
      );

      toast.success('Logged in successfully');

      // Redirect based on role
      navigate('/');
    } catch (err: any) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    showPassword,
    loading,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
  };
}
