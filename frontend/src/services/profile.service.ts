import { PROFILE_API } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const profileApi = {
  getProfilePage: async (): Promise<User> => {
    const res = await api.get(PROFILE_API.PROFILE);
    return res.data.user;
  },
  updateBasicInfo: async (payload: Partial<User>): Promise<{ message: string; user: User }> => {
    const res = await api.patch(PROFILE_API.PROFILE, payload);
    return res.data;
  },

  requestChangeEmail: async (email: string): Promise<{ message: string }> => {
    const res = await api.post(PROFILE_API.CHANGE_EMAIL, { email });
    return res.data;
  },

  requestChangePhone: async (phone: string) => {
    const res = await api.post(PROFILE_API.CHANGE_PHONE, { phone });
    return res.data;
  },

  verifyOtp: async (type: 'email' | 'phone', value: string, otp: string) => {
    const res = await api.post(PROFILE_API.VERIFY_OTP, { type, value, otp });
    return res.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post(PROFILE_API.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res.data;
  },
  resendOtp: async (type: 'email' | 'phone', value: string) => {
    const res = await api.post(PROFILE_API.RESEND_OTP, { type, value });
    return res.data;
  },
  uploadProfileImage: async (url: string) => {
    const res = await api.post(PROFILE_API.UPLOAD_IMAGE, { url });
    return res.data as { url: string };
  },
};
