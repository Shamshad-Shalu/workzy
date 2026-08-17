import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UploadPurposes } from '@/constants';
import { useImageUpload } from '@/features/profile/hooks/useImageUpload';
import WorkerProfileService from '@/services/worker/workerProfile.service';

import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';

const QUERY_KEY = ['worker-profile-details'] as const;

export function useWorkerProfileDetails() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => WorkerProfileService.getWorkerProfileDetails(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateWorkerProfile() {
  const qc = useQueryClient();

  const mutation = useMutation<{ message: string }, Error, WorkerProfileSchemaType>({
    mutationFn: (data: WorkerProfileSchemaType) => WorkerProfileService.updateWorkerProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}

export function useWorkerPhoneChange() {
  const qc = useQueryClient();
  const mutation = useMutation<{ message: string }, Error, string>({
    mutationFn: (phone: string) => WorkerProfileService.updateWorkerPhone(phone),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
  return {
    changePhone: mutation.mutateAsync,
    isChangePhone: mutation.isPending,
  };
}

export function useWorkerProfileImageUpload() {
  const qc = useQueryClient();

  const { uploadImage, loading, progress } = useImageUpload({
    purpose: UploadPurposes.WORKER_PROFILE_IMAGE,
    onSuccess: async url => {
      await WorkerProfileService.updateProfileImage(url);
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    uploadImage,
    imageUploading: loading,
    progress,
  };
}

export function useAddWorkerDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; url: string }) =>
      WorkerProfileService.addWorkerDocument(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateWorkerDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, url }: { documentId: string; url: string }) =>
      WorkerProfileService.updateWorkerDocument(documentId, url),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
