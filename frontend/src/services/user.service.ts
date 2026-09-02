import { USER_API } from '@/constants';
import type { ChangePasswordFormType } from '@/features/user/profile/validation/passwordShema';
import type { ProfileFormType } from '@/features/user/profile/validation/profileSchema';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { ResendOtpPayload, User, VerifyOtpPayload } from '@/types/user';

export const UserService = {
  uploadProfileImage: async (url: string): Promise<{ url: string }> => {
    const res = await api.post<ApiResponse<{ url: string }>>(USER_API.UPLOAD_IMAGE, { url });
    return res.data.data;
  },
  updatePhone: async (phone: string): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(USER_API.CHANGE_PHONE, { phone });
    return { message: res.data.message };
  },
  updateEmail: async (email: string): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(USER_API.CHANGE_EMAIL, { email });
    return { message: res.data.message };
  },
  updateProfile: async (data: ProfileFormType): Promise<{ message: string; user: User }> => {
    const res = await api.patch<ApiResponse<User>>(USER_API.PROFILE, data);
    return {
      message: res.data.message,
      user: res.data.data,
    };
  },
  updatePassword: async (data: ChangePasswordFormType): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(USER_API.CHANGE_PASSWORD, data);
    return { message: res.data.message };
  },
  verifyOtp: async (data: VerifyOtpPayload): Promise<{ message: string; user: User }> => {
    const res = await api.post<ApiResponse<User>>(USER_API.VERIFY_OTP, data);
    return {
      message: res.data.message,
      user: res.data.data,
    };
  },
  resendOtp: async (data: ResendOtpPayload): Promise<{ message: string }> => {
    const res = await api.post<ApiResponse<null>>(USER_API.RESEND_OTP, data);
    return { message: res.data.message };
  },
};
