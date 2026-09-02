import { useMutation } from '@tanstack/react-query';

import { UploadPurposes } from '@/constants';
import { useImageUpload } from '@/features/profile/hooks/useImageUpload';
import type { ChangePasswordFormType } from '@/features/user/profile/validation/passwordShema';
import type { ProfileFormType } from '@/features/user/profile/validation/profileSchema';
import { UserService } from '@/services/user.service';
import type { ResendOtpPayload, VerifyOtpPayload } from '@/types/user';

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
  return useMutation({
    mutationFn: (data: ProfileFormType) => UserService.updateProfile(data),
  });
}

export function useUserUpdatePhone() {
  return useMutation({
    mutationFn: (phone: string) => UserService.updatePhone(phone),
  });
}

export function useUserUpdateEmail() {
  return useMutation({
    mutationFn: (email: string) => UserService.updateEmail(email),
  });
}

export function useUserUpdatePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormType) => UserService.updatePassword(data),
  });
}

export function useUserVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => UserService.verifyOtp(data),
  });
}

export function useUserResendOtp() {
  return useMutation({
    mutationFn: (data: ResendOtpPayload) => UserService.resendOtp(data),
  });
}
