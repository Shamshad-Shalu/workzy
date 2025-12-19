import { ImageUpload } from '@/components/atoms/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { AppModal } from '@/components/molecules/AppModal';
import { AlertCircle, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ReviewWorkerSchema, type ReviewWorkerSchemaType } from '../validation/reviewWorkerShema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { WorkerStatus } from '@/types/worker';
import type { WorkerRow } from '@/types/admin/worker';

interface ReviewWorkerModalType {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedWorker: WorkerRow | null;
}

export default function ReviewWorkerModal({
  open,
  onClose,
  onSubmit,
  selectedWorker,
}: ReviewWorkerModalType) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isLoading },
  } = useForm<ReviewWorkerSchemaType>({
    resolver: zodResolver(ReviewWorkerSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'pending',
    },
  });

  const handleFormSubmit = async (data: ReviewWorkerSchemaType) => {
    if (data.status === 'pending') {
      onClose();
      return;
    }
    await onSubmit(data);
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      isConfirmLoading={isLoading}
      canCloseOnOutsideClick={!isLoading}
      title="Review Worker Application"
      confirmText="Update Status"
      onConfirm={handleSubmit(handleFormSubmit)}
      className="sm:max-w-2xl"
    >
      <div className="w-full max-h-[70vh] overflow-y-auto space-y-6 no-scrollbar">
        <div className="bg-card grid grid-cols-2 gap-4 bg-card-50 p-4 rounded-xl border border-border">
          <div className="col-span-1">
            <Label>Professional Name</Label>
            <p className="font-medium text-sm text-primary">{selectedWorker?.displayName}</p>
          </div>
          <div className="col-span-1">
            <Label>Experience</Label>
            <p className="font-medium text-sm">{selectedWorker?.experience} Years</p>
          </div>
          <div className="col-span-2">
            <Label>About</Label>
            <p className="text-sm bg-card-muted p-2 rounded border mt-1">{selectedWorker?.about}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" /> ID Proof Verification
            </h4>

            {selectedWorker?.documents?.[0]?.url ? (
              <ImageUpload
                isEditable={false}
                value={selectedWorker.documents[0].url}
                className="w-full mt-2"
              />
            ) : (
              <div className="p-4 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200 text-center italic">
                No verification document uploaded by worker.
              </div>
            )}

            <div>
              <Label>Document Name / Label</Label>
              <Input
                placeholder="e.g. Identity Card, License"
                {...register('docName', {
                  setValueAs: v => v.trim(),
                })}
                error={errors.docName?.message}
                className="px-2"
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Action</Label>
                <Select
                  placeholder="Status"
                  value={watch('status')}
                  error={errors.status?.message}
                  onChange={v => setValue('status', v as WorkerStatus)}
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Approve', value: 'verified' },
                    { label: 'Needs Revision', value: 'needs_revision' },
                    { label: 'Rejected', value: 'rejected' },
                  ]}
                />
              </div>

              <div>
                <Label>Note / Reason (Optional)</Label>
                <Input
                  placeholder="e.g. ID is blurry, Please re-upload"
                  {...register('reason', {
                    setValueAs: v => v.trim(),
                  })}
                  error={errors.reason?.message}
                  className="px-2"
                />
              </div>
              {watch('status') === 'rejected' && (
                <div className="col-span-2">
                  <Label className="text-destructive">Rejection Reason</Label>
                  <Input
                    placeholder="Reason for rejection"
                    {...register('rejectReason', {
                      setValueAs: v => v.trim(),
                    })}
                    error={errors.rejectReason?.message}
                    className="px-2 border-destructive/50 focus-visible:ring-destructive/30"
                  />
                </div>
              )}
            </div>

            {watch('status') === 'needs_revision' && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle size={12} /> The worker will be notified to fix their details based on
                your note.
              </p>
            )}
          </div>
        </form>
      </div>
    </AppModal>
  );
}
