import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';

export function useWorkerProfile() {
  const { user } = useAppSelector((s: any) => s.auth);
  async function getWorkerSummary() {
    if (!user?.workerId) {
      throw new Error('workerId not found');
    }
    return await WorkerProfileService.getWorkerSummaryById(user.workerId);
  }

  async function getWorkerProfile() {
    if (!user?.workerId) {
      throw new Error('workerId not found');
    }
    return await WorkerProfileService.getWorkerProfileById(user.workerId);
  }
  return { getWorkerSummary, getWorkerProfile };
}
