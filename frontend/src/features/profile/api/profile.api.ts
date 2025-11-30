import { PROFILE_ROUTES } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const profileApi = {
  updateBasicInfo: async (payload: Partial<User>): Promise<User> => {
    const res = await api.patch(PROFILE_ROUTES.UPDATE_BASIC, payload);
    return res.data as User;
  },

  requestChangeEmail: async (email: string): Promise<any> => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_EMAIL, { email });
    return res.data;
  },

  requestChangePhone: async (phone: string) => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_PHONE, { phone });
    return res.data;
  },

  verifyOtp: async (type: 'email' | 'phone', value: string, otp: string) => {
    const res = await api.post(PROFILE_ROUTES.VERIFY_OTP, { type, value, otp });
    return res.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res.data;
  },
  resendOtp: async (type: 'email' | 'phone', value: string) => {
    const res = await api.post(PROFILE_ROUTES.RESEND_OTP, { type, value });
    return res.data;
  },
  uploadProfileImage: async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post(PROFILE_ROUTES.UPLOAD_IMAGE, form);
    return res.data as { url: string };
  },
};
