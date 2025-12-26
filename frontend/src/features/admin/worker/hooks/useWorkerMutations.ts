import AdminWorkerService from '@/services/admin/workerManagement.service';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ReviewWorkerSchemaType } from '../validation/reviewWorkerShema';
import type { WorkerRow } from '@/types/admin/worker';

export interface VerifyWorkerResponse {
  message: string;
  worker: WorkerRow;
}

export const useVerifyWorker = (onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<VerifyWorkerResponse, Error, { id: string; data: ReviewWorkerSchemaType }>({
    mutationFn: ({ id, data }) => AdminWorkerService.verifyWorker(id, data),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
      onClose();
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });
};
