import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

export function useWorkerProfile() {
  const { user } = useAppSelector((s: RootState) => s.auth);

  if (!user || !user.workerId) {
    throw new Error('Worker ID not available');
  }
  const workerId = user.workerId;

  async function getWorkerSummary() {
    return await WorkerProfileService.getWorkerSummaryById(workerId);
  }

  async function getWorkerProfile() {
    return await WorkerProfileService.getWorkerProfileById(workerId);
  }

  async function updateWorkerProfile(data: any) {
    return await WorkerProfileService.updateWorkerProfile(workerId, data);
  }

  return { getWorkerSummary, getWorkerProfile, updateWorkerProfile };
}
