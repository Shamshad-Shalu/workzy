import { AUTH_API } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const loginService = async (email: string, password: string) => {
  const res = await api.post(AUTH_API.LOGIN, { email, password });
  return res.data as { user: User; accessToken: string };
};

export const registerService = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post(AUTH_API.REGISTER, data);
  return res.data;
};

export const verifyOtpService = async (email: string, otp: string) => {
  const res = await api.post(AUTH_API.VERIFY_OTP, { email, otp });
  return res.data as { user: User; accessToken: string };
};

export const resendOtpService = async (email: string) => {
  const res = await api.post(AUTH_API.RESEND_OTP, { email });
  return res.data;
};

export const forgotPasswordService = async (email: string) => {
  const res = await api.post(AUTH_API.FORGOT_PASSWORD, { email });
  return res.data;
};

export const resetPasswordService = async (email: string, token: string, password: string) => {
  const res = await api.post(AUTH_API.RESET_PASSWORD, {
    email,
    token,
    password,
  });
  return res.data;
};

export const logoutService = async () => {
  const res = await api.post(AUTH_API.LOGOUT, {});
  return res.data;
};

export const switchRoleService = async (): Promise<{ user: User; accessToken: string }> => {
  const res = await api.post(AUTH_API.SWITCH_ROLE);
  return res.data;
};
