import { USER_API } from '@/constants';
import type { ChangePasswordFormType } from '@/features/user/profile/validation/passwordShema';
import type { ProfileFormType } from '@/features/user/profile/validation/profileSchema';
import api from '@/lib/api/axios';
import type { ResendOtpPayload, User, VerifyOtpPayload } from '@/types/user';

export const UserService = {
  uploadProfileImage: async (url: string): Promise<{ url: string }> => {
    const res = await api.post(USER_API.UPLOAD_IMAGE, { url });
    return res.data as { url: string };
  },
  updatePhone: async (phone: string): Promise<{ message: string }> => {
    const res = await api.post(USER_API.CHANGE_PHONE, { phone });
    return res.data;
  },
  updateEmail: async (email: string): Promise<{ message: string }> => {
    const res = await api.post(USER_API.CHANGE_EMAIL, { email });
    return res.data;
  },
  updateProfile: async (data: ProfileFormType): Promise<{ message: string; user: User }> => {
    const res = await api.patch(USER_API.PROFILE, data);
    return res.data;
  },
  updatePassword: async (data: ChangePasswordFormType): Promise<{ message: string }> => {
    const res = await api.post(USER_API.CHANGE_PASSWORD, data);
    return res.data;
  },
  verifyOtp: async (data: VerifyOtpPayload): Promise<{ message: string; user: User }> => {
    const res = await api.post(USER_API.VERIFY_OTP, data);
    return res.data;
  },
  resendOtp: async (data: ResendOtpPayload) => {
    const res = await api.post(USER_API.RESEND_OTP, data);
    return res.data;
  },
};
