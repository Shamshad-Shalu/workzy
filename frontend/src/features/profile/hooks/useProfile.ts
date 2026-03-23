import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { UploadPurposes } from '@/constants/upload';
import { profileApi } from '@/services/profile.service';
import { uploadToS3 } from '@/services/upload.service';
import type { User } from '@/types/user';
import { handleApiError } from '@/utils/handleApiError';
import { compressAndConvertToWebP, validateImage } from '@/utils/imageCompression';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const getUserProfilePage = useCallback(async () => {
    setLoading(true);
    try {
      return await profileApi.getProfilePage();
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBasic = useCallback(async (payload: Partial<User>) => {
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
      return await profileApi.updateBasicInfo(payload);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const changeEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      return await profileApi.requestChangeEmail(email);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePhone = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      return await profileApi.requestChangePhone(phone);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      return await profileApi.changePassword(currentPassword, newPassword);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    setImageLoading(true);
    setImageProgress(0);
    try {
      const error = validateImage(file, 10);
      if (error) {
        throw new Error(error);
      }

      const compressedFile = await compressAndConvertToWebP(file);
      const url = await uploadToS3({
        file: compressedFile,
        purpose: UploadPurposes.PROFILE_IMAGE,
        onProgress: p => setImageProgress(p),
      });
      const res = await profileApi.uploadProfileImage(url);
      setImageProgress(100);
      return res;
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setImageLoading(false);
      setTimeout(() => setImageProgress(0), 1000);
    }
  }, []);

  const verifyOtp = useCallback(async (type: 'email' | 'phone', value: string, otp: string) => {
    setLoading(true);
    try {
      return await profileApi.verifyOtp(type, value, otp);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (type: 'email' | 'phone', value: string) => {
    setLoading(true);
    try {
      return await profileApi.resendOtp(type, value);
    } catch (err) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    getUserProfilePage,
    updateBasic,
    changeEmail,
    changePhone,
    changePassword,
    uploadImage,
    imageLoading,
    imageProgress,
    verifyOtp,
    resendOtp,
  };
}
