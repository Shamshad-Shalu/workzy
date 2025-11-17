import { AUTH_ROUTES } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const loginService = async (email: string, password: string) => {
  const res = await api.post(AUTH_ROUTES.LOGIN, { email, password });
  return res.data as { user: User; accessToken: string };
};

export const registerService = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post(AUTH_ROUTES.REGISTER, data);
  return res.data;
};

export const verifyOtpService = async (email: string, otp: string) => {
  const res = await api.post(AUTH_ROUTES.VERIFY_OTP, { email, otp });
  return res.data as { user: User; accessToken: string };
};

export const resendOtpService = async (email: string) => {
  const res = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
  return res.data;
};

export const forgotPasswordService = async (email: string) => {
  const res = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
  return res.data;
};

export const resetPasswordService = async (email: string, token: string, password: string) => {
  const res = await api.post(AUTH_ROUTES.RESET_PASSWORD, {
    email,
    token,
    password,
  });
  return res.data;
};

export const googleAuthService = () => {
  window.location.href = AUTH_ROUTES.GOOGLE;
};

export const logoutService = async () => {
  const res = await api.get(AUTH_ROUTES.LOGOUT, {});
  return res.data;
};
