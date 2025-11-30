// src/features/profile/common/hooks/useProfile.ts
import { useState } from 'react';
import { profileApi } from '../api/profile.api';
// import { workerProfileApi } from '@/features/worker/profile/api/workerProfile.api';
import type { User } from '@/types/user';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';

export function useProfile() {
  const [loading, setLoading] = useState(false);

  async function updateBasic(payload: Partial<User>) {
    setLoading(true);
    try {
      const user = await profileApi.updateBasicInfo(payload);
      return user;
    } catch (err: any) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function changeEmail(newEmail: string) {
    setLoading(true);
    try {
      return await profileApi.requestChangeEmail(newEmail);
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File) {
    setLoading(true);
    try {
      return await profileApi.uploadProfileImage(file);
    } catch (err: any) {
      toast.error(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  //   async function updateWorker(payload: Parameters<typeof workerProfileApi.updateWorkerProfile>[0]) {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const u = await workerProfileApi.updateWorkerProfile(payload);
  //       setLoading(false);
  //       return u;
  //     } catch (err: any) {
  //       setLoading(false);
  //       setError(err?.message || 'Update failed');
  //       throw err;
  //     }
  //   }

  return {
    loading,
    updateBasic,
    changeEmail,
    changePhone,
    changePassword,
    uploadImage,
    // updateWorker,
  };
}
