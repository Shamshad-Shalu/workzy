import { PROFILE_ROUTES } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const profileApi = {
  updateBasicInfo: async (payload: Partial<User>): Promise<User> => {
    const res = await api.patch(PROFILE_ROUTES.UPDATE_BASIC, payload);
    return res.data as User;
  },

  requestChangeEmail: async (email: string) => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_EMAIL, { email });
    return res.data;
  },

  verifyEmailOtp: async (email: string, otp: string) => {
    const res = await api.post(PROFILE_ROUTES.VERIFY_EMAIL_OTP, { email, otp });
    return res.data;
  },

  requestChangePhone: async (phone: string) => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_PHONE, { phone });
    return res.data;
  },

  verifyPhoneOtp: async (phone: string, otp: string) => {
    const res = await api.post(PROFILE_ROUTES.VERIFY_PHONE_OTP, { phone, otp });
    return res.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post(PROFILE_ROUTES.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  uploadProfileImage: async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post(PROFILE_ROUTES.UPLOAD_IMAGE, form);
    return res.data as { url: string };
  },
};
