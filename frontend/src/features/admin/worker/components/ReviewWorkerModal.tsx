import { ImageUpload } from '@/components/atoms/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { AppModal } from '@/components/molecules/AppModal';
import { Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ReviewWorkerSchema, type ReviewWorkerSchemaType } from '../validation/reviewWorkerShema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { WorkerStatus } from '@/types/worker';
import type { WorkerRow } from '@/types/admin/worker';
import { Textarea } from '@/components/atoms/Textarea';
import { useEffect } from 'react';

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
    reset
  } = useForm<ReviewWorkerSchemaType>({
    resolver: zodResolver(ReviewWorkerSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'pending',
      docId:selectedWorker?.documents[0]._id,
    },
  });

  const handleFormSubmit = async (data: ReviewWorkerSchemaType) => {
    if (data.status === 'pending') {
      onClose();
      return;
    }
    onSubmit(data);
    reset()
  };

  useEffect(() => {
    if (selectedWorker?.documents?.[0]?._id) {
      setValue('docId', selectedWorker.documents[0]._id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedWorker, setValue]);


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

        </div>                                         
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-1">
            <input type="hidden" {...register('docId')} />
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <div>
                <Label>Worker Status</Label>
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
              {watch('status') === 'verified' && (
                <div>
                  <Label>Document Name </Label>
                  <Input
                    placeholder="e.g. Verified Worker" 
                    {...register('docName', {
                      setValueAs: v => v.trim(),
                    })}
                    error={errors.docName?.message}
                    className="px-2"
                  />
                </div>
              )}
            </div>
            {(watch('status') === 'rejected' || watch('status') === 'needs_revision' )&& (
              <div className="col-span-2">
                <Label>Rejection Reason</Label>
                <Textarea 
                    placeholder="Reason for rejection"
                    {...register('reason', {
                      setValueAs: v => v.trim(),
                    })}
                    error={errors.reason?.message}
                />
              
              </div>
            )}
          </div>
        </form>
      </div>
    </AppModal>
  );
}
