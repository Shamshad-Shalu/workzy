import { useState } from 'react';

import { useResolveDispute } from '@/features/admin/disputes/hooks/useResolveDispute';
import type { ResolveDisputeFormType } from '@/features/admin/disputes/validation/resolveDispute.schema';

import { useDisputeDetails } from './useDispute';
import { useRaiseDispute } from './useRaiseDispute';
import { useUpdateDispute } from './useUpdateDispute';

import type { RaiseDisputeFormType } from '../validation/raiseDispute.schema';

type DisputeModalMode = 'view' | 'edit' | 'resolve';

export function useDisputeModal(bookingId?: string | null, onClose?: () => void) {
  const [mode, setMode] = useState<DisputeModalMode>('view');
  const [isUploading, setIsUploading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const { dispute, isLoading: isDisputeLoading } = useDisputeDetails(bookingId);
  const { mutateAsync: raiseDispute, isPending: isRaisingPending } = useRaiseDispute();
  const { mutateAsync: updateDispute, isPending: isUpdatingPending } = useUpdateDispute();
  const { mutateAsync: resolveDispute, isPending: isResolvingPending } = useResolveDispute();

  const isSubmitting = isRaisingPending || isUpdatingPending;
  const openEdit = () => setMode('edit');
  const openResolve = () => setMode('resolve');
  const backToView = () => setMode('view');

  const openPreview = (index: number) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);
  const previousPreview = () => setPreviewIndex(i => (i === null ? null : Math.max(0, i - 1)));
  const nextPreview = (max: number) =>
    setPreviewIndex(i => (i === null ? null : Math.min(max, i + 1)));

  const handleRaiseOrUpdate = async (data: RaiseDisputeFormType) => {
    if (!bookingId) {
      return;
    }
    if (dispute) {
      const { message } = await updateDispute({ disputeId: dispute.id, data });
      backToView();
      onClose?.();
      return message;
    } else {
      const { message } = await raiseDispute({ bookingId, data });
      backToView();
      onClose?.();
      return message;
    }
  };

  const handleResolve = async (data: ResolveDisputeFormType) => {
    if (!dispute) {
      return;
    }
    const res = await resolveDispute({ disputeId: dispute.id, data });
    backToView();
    onClose?.();
    return res.message;
  };

  const handleClose = () => {
    backToView();
    onClose?.();
  };

  return {
    dispute,
    mode,
    previewIndex,
    isUploading,

    isDisputeLoading,
    isSubmitting,
    isResolvingSubmitting: isResolvingPending,

    openEdit,
    openResolve,
    backToView,
    openPreview,
    closePreview,

    setIsUploading,
    previousPreview,
    nextPreview,

    handleRaiseOrUpdate,
    handleResolve,
    handleClose,
  };
}
