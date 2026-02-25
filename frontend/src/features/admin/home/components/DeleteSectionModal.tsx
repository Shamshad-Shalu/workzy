import { Trash2 } from 'lucide-react';

import { AppModal } from '@/components/molecules/AppModal';

interface DeleteSectionModalProps {
  open: boolean;
  sectionName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSectionModal({
  open,
  sectionName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteSectionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <AppModal
      open={open}
      onClose={() => !loading && onClose()}
      isTitleHidden
      canCloseOnOutsideClick={!loading}
      className="sm:max-w-md"
      onConfirm={onConfirm}
      buttonVariant="red"
      isConfirmLoading={loading}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="size-6 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Delete Section</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">{sectionName}</span>?
            </p>
            <p className="mt-2 text-xs text-red-500">This action cannot be undone.</p>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
