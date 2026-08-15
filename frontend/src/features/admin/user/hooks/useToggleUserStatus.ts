import { useState } from 'react';
import { toast } from 'sonner';

import { handleApiError } from '@/utils/handleApiError';

import { useReviewUser } from './useReviewUser';

export function useToggleUserStatus() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const { mutateAsync: toggleStatus, isPending } = useReviewUser();

  const openModal = (userId: string) => setTargetId(userId);
  const closeModal = () => setTargetId(null);

  const handleConfirm = async () => {
    if (!targetId) {
      return;
    }
    try {
      const res = await toggleStatus(targetId);
      toast.success(res.message);
      closeModal();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return {
    targetId,
    isModalOpen: !!targetId,
    openModal,
    closeModal,
    handleConfirm,
    isPending,
  };
}
