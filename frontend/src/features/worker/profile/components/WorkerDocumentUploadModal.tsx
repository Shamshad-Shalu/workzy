import { FileCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { AppModal } from '@/components/molecules/AppModal';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes } from '@/constants';
import { WORKER_DOCUMENT_OPTIONS, getDocInfo } from '@/features/admin/worker/utils/documentUtils';
import type { WorkerDocument } from '@/types/worker';

interface WorkerDocumentUploadModalProps {
  open: boolean;
  editingDoc?: WorkerDocument | null;
  existingDocTypes?: string[];
  onClose: () => void;
  onSubmit: (data: { type: string; url: string }) => Promise<void> | void;
  isLoading?: boolean;
}

export function WorkerDocumentUploadModal({
  open,
  editingDoc,
  existingDocTypes = [],
  onClose,
  onSubmit,
  isLoading = false,
}: WorkerDocumentUploadModalProps) {
  const [selectedType, setSelectedType] = useState<string>(editingDoc?.type ?? '');
  const [uploadedUrl, setUploadedUrl] = useState<string>(editingDoc?.url ?? '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    setSelectedType(editingDoc?.type ?? '');
    setUploadedUrl(editingDoc?.url ?? '');
  }, [editingDoc, open]);

  const availableTypeOptions = WORKER_DOCUMENT_OPTIONS.filter(
    opt => editingDoc || !existingDocTypes.includes(opt.value)
  );

  const isEditMode = !!editingDoc;
  const isUrlUnchanged = isEditMode && uploadedUrl === editingDoc?.url;
  const currentDocInfo = selectedType ? getDocInfo(selectedType) : null;

  const handleSubmit = async () => {
    if (!selectedType && !editingDoc) {
      toast.error('Please select a document type.');
      return;
    }
    if (!uploadedUrl) {
      toast.error('Please upload a document file.');
      return;
    }
    if (isUrlUnchanged) {
      toast.error('Please upload a new document image to re-submit.');
      return;
    }

    await onSubmit({
      type: editingDoc?.type ?? selectedType,
      url: uploadedUrl,
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditMode ? `Update ${getDocInfo(editingDoc.type).label}` : 'Add Trade Credential'}
      onConfirm={handleSubmit}
      confirmText={isEditMode ? 'Re-submit Document' : 'Submit Document'}
      isConfirmDisabled={
        !uploadedUrl || (!selectedType && !isEditMode) || isUploadingImage || isUrlUnchanged
      }
      isConfirmLoading={isLoading}
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-2">
        {!isEditMode ? (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Select Document Type</Label>
            <Select
              value={selectedType}
              onChange={val => setSelectedType(val)}
              options={availableTypeOptions}
              placeholder="Select document category..."
              leftIcon={<FileCheck size={16} />}
            />
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-muted/40 border border-border text-sm flex items-center gap-2">
            <FileCheck size={16} className="text-primary" />
            <span className="font-semibold text-foreground">
              {currentDocInfo?.label || editingDoc.type}
            </span>
          </div>
        )}

        {/* Image Upload Component */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Document File / Image</Label>
          <ImageUpload
            value={uploadedUrl}
            onChange={url => setUploadedUrl(url)}
            purpose={UploadPurposes.WORKER_DOCUMENT}
            onUploadingChange={setIsUploadingImage}
          />
        </div>
      </div>
    </AppModal>
  );
}
