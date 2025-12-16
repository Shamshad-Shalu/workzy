import { useState } from 'react';
import { profileApi } from '../api/profile.api';
import type { User } from '@/types/user';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  async function getUserProfilePage() {
    setLoading(true);
    try {
      const user = await profileApi.getProfilePage();
      return user;
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function updateBasic(payload: Partial<User>) {
    setLoading(true);
    try {
      if (payload.profile?.address) {
        const address = payload.profile.address;
        Object.keys(address).forEach(key => {
          const k = key as keyof typeof address;
          if (address[k] === '' || address[k] === undefined) {
            delete address[k];
          }
        });
        // If address is now empty, remove it entirely
        if (Object.keys(address).length === 0) {
          delete payload.profile!.address;
        }
      }
      const user = await profileApi.updateBasicInfo(payload);
      return user;
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function changeEmail(email: string) {
    setLoading(true);
    try {
      return await profileApi.requestChangeEmail(email);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function changePhone(phone: string) {
    setLoading(true);
    try {
      return await profileApi.requestChangePhone(phone);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    setLoading(true);
    try {
      return await profileApi.changePassword(currentPassword, newPassword);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File) {
    setImageLoading(true);
    try {
      return await profileApi.uploadProfileImage(file);
    } catch (err: any) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setImageLoading(false);
    }
  }
  async function verifyOtp(type: 'email' | 'phone', value: string, otp: string) {
    setLoading(true);
    try {
      return await profileApi.verifyOtp(type, value, otp);
    } catch (err: any) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp(type: 'email' | 'phone', value: string) {
    setLoading(true);
    try {
      return await profileApi.resendOtp(type, value);
    } catch (err: any) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    getUserProfilePage,
    updateBasic,
    changeEmail,
    changePhone,
    changePassword,
    uploadImage,
    imageLoading,
    verifyOtp,
    resendOtp,
  };
}
