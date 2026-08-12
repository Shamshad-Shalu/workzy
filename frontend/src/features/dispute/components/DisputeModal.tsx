import { Edit, UserCheck, ArrowLeft } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import { MediaViewer, type MediaItem } from '@/components/organisms/MediaViewer';
import { ROLE, type Role } from '@/constants';
import { DISPUTE_STATUS } from '@/constants/dispute';

import { useDisputeModal } from '../hooks/useDisputeModal';

import DisputeDetailsView from './DisputeDetailsView';
import DisputeModalSkeleton from './DisputeModalSkeleton';
import RaiseDisputeForm from './RaiseDisputeForm';
import ResolveDisputeForm from './ResolveDisputeForm';

interface Props {
  open: boolean;
  onClose: () => void;
  role?: Role;
  bookingId?: string | null;
}

export default function DisputeModal({ open, onClose, bookingId, role = ROLE.USER }: Props) {
  const {
    dispute,
    isDisputeLoading,
    isSubmitting,
    isResolvingSubmitting,
    isUploading,
    mode,
    previewIndex,
    openPreview,
    closePreview,
    setIsUploading,
    nextPreview,
    previousPreview,
    backToView,
    openEdit,
    openResolve,
    handleRaiseOrUpdate,
    handleResolve,
    handleClose,
  } = useDisputeModal(bookingId, onClose);

  const evidenceItems = dispute?.evidence ?? [];

  const isEditMode = mode === 'edit';
  const isResolveMode = mode === 'resolve';
  const modalTitle = isDisputeLoading
    ? 'Loading Dispute...'
    : !dispute
      ? 'Raise a Dispute'
      : mode === 'edit'
        ? 'Edit Dispute Details'
        : mode === 'resolve'
          ? 'Resolve Dispute'
          : `Dispute Details: #${dispute.disputeId}`;

  return (
    <>
      <AppModal
        open={open && previewIndex === null}
        onClose={handleClose}
        title={modalTitle}
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

              {mode === 'view' && dispute && (
                <>
                  {dispute?.status === DISPUTE_STATUS.PENDING && dispute.raisedBy === role && (
                    <Button iconLeft={<Edit size={16} />} onClick={openEdit}>
                      Edit Dispute
                    </Button>
                  )}
                  {role === ROLE.ADMIN &&
                    dispute.status !== DISPUTE_STATUS.RESOLVED &&
                    dispute.status !== DISPUTE_STATUS.DISMISSED && (
                      <Button
                        onClick={openResolve}
                        variant="green"
                        iconLeft={<UserCheck size={16} />}
                      >
                        Resolve Dispute
                      </Button>
                    )}
                </>
              )}

              {isResolveMode && (
                <>
                  <Button
                    variant="outline"
                    onClick={backToView}
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
            {!dispute || isEditMode ? (
              <RaiseDisputeForm
                mediaUploading={setIsUploading}
                onSubmit={handleRaiseOrUpdate}
                dispute={dispute}
                onPreview={openPreview}
                key={dispute?.id}
              />
            ) : isResolveMode ? (
              <ResolveDisputeForm
                dispute={dispute}
                onSubmit={handleResolve}
                isSubmitting={isResolvingSubmitting}
              />
            ) : dispute ? (
              <DisputeDetailsView dispute={dispute} role={role} onPreview={openPreview} />
            ) : null}
          </div>
        )}
      </AppModal>
      {previewIndex !== null && evidenceItems[previewIndex] && (
        <MediaViewer
          item={evidenceItems[previewIndex] as MediaItem}
          onClose={closePreview}
          onPrev={previousPreview}
          onNext={() => nextPreview(evidenceItems.length - 1)}
          hasPrev={previewIndex > 0}
          hasNext={previewIndex < evidenceItems.length - 1}
          counter={`${previewIndex + 1} / ${evidenceItems.length}`}
        />
      )}
    </>
  );
}
