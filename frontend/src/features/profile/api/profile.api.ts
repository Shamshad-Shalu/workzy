import api from '@/lib/api/axios';
import type { User } from '@/types/user';

export const profileApi = {
  // get current user profile (if needed)
  getProfile: async (): Promise<User> => {
    const res = await api.get('/api/profile/me');
    return res.data as User;
  },

  // update basic fields (name, phone, etc)
  updateBasicInfo: async (payload: Partial<User>): Promise<User> => {
    const res = await api.put('/api/profile', payload);
    return res.data as User;
  },

  // change email (start)
  requestChangeEmail: async (newEmail: string) => {
    const res = await api.post('/api/profile/change-email', { email: newEmail });
    return res.data;
  },

  // verify email OTP
  verifyEmailOtp: async (email: string, otp: string) => {
    const res = await api.post('/api/profile/verify-email-otp', { email, otp });
    return res.data;
  },

  // change phone (start)
  requestChangePhone: async (phone: string) => {
    const res = await api.post('/api/profile/change-phone', { phone });
    return res.data;
  },

  // verify phone OTP
  verifyPhoneOtp: async (phone: string, otp: string) => {
    const res = await api.post('/api/profile/verify-phone-otp', { phone, otp });
    return res.data;
  },

  // change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post('/api/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  // upload profile image (FormData)
  uploadProfileImage: async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post('/api/profile/upload-profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as { url: string };
  },
};
