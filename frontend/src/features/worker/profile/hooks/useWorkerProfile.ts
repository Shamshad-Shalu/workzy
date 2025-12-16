import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';

export function useWorkerProfile() {
  const { user } = useAppSelector((s: any) => s.auth);
  if (!user?.workerId) {
    throw new Error('Worker ID not available');
  }

  async function getWorkerSummary() {
    return await WorkerProfileService.getWorkerSummaryById(user.workerId);
  }

  async function getWorkerProfile() {
    return await WorkerProfileService.getWorkerProfileById(user.workerId);
  }

  async function updateWorkerProfile(data: any) {
    return await WorkerProfileService.updateWorkerProfile(user.workerId, data);
  }

  return { getWorkerSummary, getWorkerProfile, updateWorkerProfile };
}
