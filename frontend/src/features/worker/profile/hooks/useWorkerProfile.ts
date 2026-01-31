import { useCallback } from 'react';

import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';

export function useWorkerProfile() {
  const { user } = useAppSelector((s: RootState) => s.auth);

  if (!user || !user.workerId) {
    throw new Error('Worker ID not available');
  }
  const workerId = user.workerId;

  const getWorkerSummary = useCallback(() => {
    return WorkerProfileService.getWorkerSummaryById(workerId);
  }, [workerId]);

  const getWorkerProfile = useCallback(() => {
    return WorkerProfileService.getWorkerProfileById(workerId);
  }, [workerId]);

  const updateWorkerProfile = useCallback(
    (data: WorkerProfileSchemaType) => {
      return WorkerProfileService.updateWorkerProfile(workerId, data);
    },
    [workerId]
  );

  return { getWorkerSummary, getWorkerProfile, updateWorkerProfile };
}
