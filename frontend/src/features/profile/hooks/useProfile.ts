// src/features/profile/common/hooks/useProfile.ts
import { useState } from 'react';
import { profileApi } from '../api/profile.api';
// import { workerProfileApi } from '@/features/worker/profile/api/workerProfile.api';
import type { User } from '@/types/user';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateBasic(payload: Partial<User>) {
    setLoading(true);
    setError(null);
    try {
      const user = await profileApi.updateBasicInfo(payload);
      setLoading(false);
      return user;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Something went wrong');
      throw err;
    }
  }

  async function changeEmail(newEmail: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.requestChangeEmail(newEmail);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Something went wrong');
      throw err;
    }
  }

  async function changePhone(phone: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.requestChangePhone(phone);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Something went wrong');
      throw err;
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.changePassword(currentPassword, newPassword);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Something went wrong');
      throw err;
    }
  }

  async function uploadImage(file: File) {
    setLoading(true);
    try {
      const res = await profileApi.uploadProfileImage(file);
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Upload failed');
      throw err;
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
    error,
    updateBasic,
    changeEmail,
    changePhone,
    changePassword,
    uploadImage,
    // updateWorker,
  };
}
