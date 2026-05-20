import { Edit, UserCheck, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { ROLE, type Role } from '@/constants';
import { DISPUTE_STATUS } from '@/constants/dispute';
import { useResolveDispute } from '@/features/admin/disputes/hooks/useDisputes';
import type { DisputeResolveFormType } from '@/features/admin/disputes/validation/disputeResolveFormData';
import { handleApiError } from '@/utils/handleApiError';

import { useDisputeDetails, useRaiseDispute, useUpdateDispute } from '../hooks/useDisputes';

import DisputeDetailsView from './DisputeDetailsView';
import DisputeModalSkeleton from './DisputeModalSkeleton';
import RaiseDisputeForm from './RaiseDisputeForm';
import ResolveDisputeForm from './ResolveDisputeForm';

import type { DisputeFormType } from '../validation/disputeFormData';

interface Props {
  open: boolean;
  onClose: () => void;
  role?: Role;
  bookingId?: string | null;
}

export default function DisputeModal({ open, onClose, bookingId, role = ROLE.USER }: Props) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { dispute, isLoading: isDisputeLoading, refetch } = useDisputeDetails(bookingId);
  const { mutateAsync: updateDisputeMutation, isPending: isUpdatingPending } = useUpdateDispute();
  const { mutateAsync: raiseDisputeMutation, isPending: isRaisingPending } = useRaiseDispute();
  const isSubmitting = isUpdatingPending || isRaisingPending;
  const { mutateAsync: resolveDisputeMutation, isPending: isResolvingSubmitting } =
    useResolveDispute();

  const evidenceItems = dispute?.evidence ?? [];

  const handleRaiseDispute = async (data: DisputeFormType) => {
    try {
      if (!bookingId) {
        return;
      }
      if (dispute) {
        const { message } = await updateDisputeMutation({
          disputeId: dispute.id,
          data,
        });
        onClose();
        setIsEditMode(false);
        return message;
      } else {
        const { message } = await raiseDisputeMutation({
          bookingId,
          data,
        });
        onClose();
        setIsEditMode(false);
        return message;
      }
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const handleResolveSubmit = async (data: DisputeResolveFormType) => {
    try {
      if (!dispute) {
        return;
      }
      const { message } = await resolveDisputeMutation({
        disputeId: dispute.id,
        data,
      });
      setIsResolving(false);
      refetch();
      onClose();
      return message;
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    setIsResolving(false);
    onClose();
  };

  const renderModalTitle = () => {
    if (isDisputeLoading) {
      return 'Loading Dispute...';
    }
    if (!dispute) {
      return 'Raise a Dispute';
    }
    if (isResolving) {
      return 'Resolve Dispute (Admin Panel)';
    }
    if (isEditMode) {
      return 'Edit Dispute Details';
    }
    return `Dispute details: #${dispute.disputeId || 'Active'}`;
  };

  return (
    <>
      <AppModal
        open={open && previewIndex === null}
        onClose={handleClose}
        title={renderModalTitle()}
        canCloseOnOutsideClick={!isSubmitting && !isResolvingSubmitting && !isUploading}
        className="sm:max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-2xl "
        footer={
          !isDisputeLoading ? (
            <div className="flex justify-end gap-3 w-full sm:w-auto mt-4 pt-2 ">
              <Button
                variant="outline"
                disabled={isSubmitting || isResolvingSubmitting}
                onClick={handleClose}
                className="flex-1 sm:flex-none"
              >
                Close
              </Button>

              {(isEditMode || !dispute) && (
                <Button
                  type="submit"
                  form="raise-dispute-form"
                  variant="red"
                  disabled={isSubmitting || isUploading}
                  loading={isSubmitting}
                  className="flex-1 sm:flex-none font-medium px-6"
                >
                  {dispute ? 'Save Changes' : 'Submit Dispute'}
                </Button>
              )}

              {!isEditMode && !isResolving && dispute && (
                <>
                  {dispute?.status === DISPUTE_STATUS.PENDING && dispute.raisedBy === role && (
                    <Button iconLeft={<Edit size={16} />} onClick={() => setIsEditMode(true)}>
                      Edit Dispute
                    </Button>
                  )}
                  {role === ROLE.ADMIN &&
                    dispute.status !== DISPUTE_STATUS.RESOLVED &&
                    dispute.status !== DISPUTE_STATUS.DISMISSED && (
                      <Button
                        onClick={() => setIsResolving(true)}
                        variant="green"
                        iconLeft={<UserCheck size={16} />}
                      >
                        Resolve Dispute
                      </Button>
                    )}
                </>
              )}

              {isResolving && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsResolving(false)}
                    className="flex items-center gap-1 flex-1 sm:flex-none"
                  >
                    <ArrowLeft size={16} /> Back
                  </Button>
                  <Button
                    type="submit"
                    variant="green"
                    form="resolve-dispute-form"
                    loading={isResolvingSubmitting}
                  >
                    Confirm Resolution
                  </Button>
                </>
              )}
            </div>
          ) : null
        }
      >
        {isDisputeLoading ? (
          <DisputeModalSkeleton />
        ) : (
          <div className="space-y-6 pt-2">
            {isEditMode || !dispute ? (
              <RaiseDisputeForm
                role={role}
                mediaUploading={setIsUploading}
                onSubmit={handleRaiseDispute}
                dispute={dispute}
                onPreview={setPreviewIndex}
                key={dispute?.id}
              />
            ) : isResolving ? (
              <ResolveDisputeForm
                dispute={dispute}
                onSubmit={handleResolveSubmit}
                isSubmitting={isResolvingSubmitting}
              />
            ) : dispute ? (
              <DisputeDetailsView dispute={dispute} role={role} onPreview={setPreviewIndex} />
            ) : null}
          </div>
        )}
      </AppModal>
      {previewIndex !== null && evidenceItems[previewIndex] && (
        <MediaViewer
          item={evidenceItems[previewIndex] as MediaItem}
          onClose={() => setPreviewIndex(null)}
          onPrev={() => setPreviewIndex(i => Math.max(0, i! - 1))}
          onNext={() => setPreviewIndex(i => Math.min(evidenceItems.length - 1, i! + 1))}
          hasPrev={previewIndex > 0}
          hasNext={previewIndex < evidenceItems.length - 1}
          counter={`${previewIndex + 1} / ${evidenceItems.length}`}
        />
      )}
    </>
  );
}
