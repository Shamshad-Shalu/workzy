import { AUTH_API } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export const loginService = async (
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; message: string }> => {
  const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(AUTH_API.LOGIN, {
    email,
    password,
  });
  return {
    ...res.data.data,
    message: res.data.message,
  };
};

export const registerService = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ message: string }> => {
  const res = await api.post<ApiResponse<null>>(AUTH_API.REGISTER, data);
  return { message: res.data.message };
};

export const verifyOtpService = async (
  email: string,
  otp: string
): Promise<{ user: User; accessToken: string; message: string }> => {
  const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
    AUTH_API.VERIFY_OTP,
    {
      email,
      otp,
    }
  );
  return {
    ...res.data.data,
    message: res.data.message,
  };
};

export const resendOtpService = async (email: string): Promise<{ message: string }> => {
  const res = await api.post<ApiResponse<null>>(AUTH_API.RESEND_OTP, { email });
  return { message: res.data.message };
};

export const forgotPasswordService = async (email: string): Promise<{ message: string }> => {
  const res = await api.post<ApiResponse<null>>(AUTH_API.FORGOT_PASSWORD, { email });
  return { message: res.data.message };
};

export const resetPasswordService = async (
  email: string,
  token: string,
  password: string
): Promise<{ message: string }> => {
  const res = await api.post<ApiResponse<null>>(AUTH_API.RESET_PASSWORD, {
    email,
    token,
    password,
  });
  return { message: res.data.message };
};

export const logoutService = async (): Promise<{ message: string }> => {
  const res = await api.post<ApiResponse<null>>(AUTH_API.LOGOUT, {});
  return { message: res.data.message };
};

export const switchRoleService = async (): Promise<{
  user: User;
  accessToken: string;
  message: string;
}> => {
  const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>(
    AUTH_API.SWITCH_ROLE
  );
  return {
    ...res.data.data,
    message: res.data.message,
  };
};
