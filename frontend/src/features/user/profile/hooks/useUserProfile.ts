import { useMutation } from '@tanstack/react-query';

import { UploadPurposes } from '@/constants';
import { useImageUpload } from '@/features/profile/hooks/useImageUpload';
import type { ChangePasswordFormType } from '@/features/user/profile/validation/passwordShema';
import type { ProfileFormType } from '@/features/user/profile/validation/profileSchema';
import { UserService } from '@/services/user.service';
import type { ResendOtpPayload, User, VerifyOtpPayload } from '@/types/user';

export function useUserProfileImageUpload() {
  const { uploadImage, loading, progress } = useImageUpload({
    purpose: UploadPurposes.PROFILE_IMAGE,
    onSuccess: async url => {
      await UserService.uploadProfileImage(url);
    },
  });

  return {
    uploadImage,
    imageUploading: loading,
    progress,
  };
}

export function useUpdateUserProfile() {
  const mutation = useMutation<{ message: string; user: User }, Error, ProfileFormType>({
    mutationFn: (data: ProfileFormType) => UserService.updateProfile(data),
  });
  return {
    updateProfile: mutation.mutateAsync,
  };
}

export function useUserUpdatePhone() {
  const mutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (phone: string) => UserService.updatePhone(phone),
  });
  return {
    updatePhone: mutation.mutateAsync,
    isUpdatingPhone: mutation.isPending,
    error: mutation.error,
  };
}

export function useUserUpdateEmail() {
  const mutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (email: string) => UserService.updateEmail(email),
  });
  return {
    updateEmail: mutation.mutateAsync,
    isUpdatingEmail: mutation.isPending,
  };
}
export function useUserUpdatePassword() {
  const mutation = useMutation<{ message: string }, Error, ChangePasswordFormType>({
    mutationFn: (data: ChangePasswordFormType) => UserService.updatePassword(data),
  });
  return {
    updatePassword: mutation.mutateAsync,
  };
}

export function useUserVerifyOtp() {
  const mutation = useMutation<{ message: string; user: User }, Error, VerifyOtpPayload>({
    mutationFn: (data: VerifyOtpPayload) => UserService.verifyOtp(data),
  });
  return {
    verifyOtp: mutation.mutateAsync,
    isVerifying: mutation.isPending,
  };
}

export function useUserResendOtp() {
  const mutation = useMutation<{ message: string }, Error, ResendOtpPayload>({
    mutationFn: (data: ResendOtpPayload) => UserService.resendOtp(data),
  });
  return {
    resendOtp: mutation.mutateAsync,
    isResending: mutation.isPending,
  };
}
