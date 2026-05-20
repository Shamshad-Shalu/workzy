import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { MultiUpload } from '@/components/molecules/MultiUpload';
import { ROLE, UploadPurposes, type Role } from '@/constants';
import { DISPUTE_REASON, DISPUTE_REASON_LABELS } from '@/constants/dispute';
import type { Dispute } from '@/types/dispute';
import { handleApiError } from '@/utils/handleApiError';

import { disputeSchema, type DisputeFormType } from '../validation/disputeFormData';

interface Props {
  role?: Role;
  onSubmit: (data: DisputeFormType) => Promise<string | undefined | void>;
  dispute?: Dispute | null;
  mediaUploading: (isUploading: boolean) => void;
  onPreview: (index: number) => void;
}

const DEFAULT_FORM_VALUES: DisputeFormType = {
  reason: DISPUTE_REASON.NOT_FINISHED,
  description: '',
  evidence: [],
  raisedBy: ROLE.USER,
};

export default function RaiseDisputeForm({
  role = ROLE.USER,
  dispute,
  onSubmit,
  mediaUploading,
  onPreview,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DisputeFormType>({
    resolver: zodResolver(disputeSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      reason: dispute?.reason || DEFAULT_FORM_VALUES.reason,
      description: dispute?.description || DEFAULT_FORM_VALUES.description,
      evidence: dispute?.evidence || DEFAULT_FORM_VALUES.evidence,
      raisedBy: dispute?.raisedBy || role,
    });
  }, [dispute, role, reset]);

  const onSubmitForm = async (data: DisputeFormType) => {
    try {
      const message = await onSubmit(data);
      if (message) {
        toast.success(message);
        reset();
      }
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 p-4 rounded-xl border bg-section-amber text-section-amber-text border-section-amber-border">
        <ShieldAlert size={20} className="flex-shrink-0 mt-0.5 text-section-amber-text" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">Safe Escrow Resolution</p>
          <p className="text-xs leading-relaxed opacity-90">
            Disputes are thoroughly investigated by our support team within 24-48 hours. We review
            booking agreements, evidence photos, and chat histories to make a fair and balanced
            determination.
          </p>
        </div>
      </div>

      <form id="raise-dispute-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <Label className="text-foreground/90 font-semibold text-sm">Reason for Dispute</Label>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select
                options={Object.entries(DISPUTE_REASON_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select why you are disputing..."
                error={errors.reason?.message}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-foreground/90 font-semibold text-sm">Details & Description</Label>
          <Textarea
            placeholder="Provide a clear description of what occurred..."
            disabled={isSubmitting}
            error={errors.description?.message}
            rows={5}
            {...register('description')}
            className="resize-none rounded-xl bg-background border-border text-foreground placeholder-muted-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            name="evidence"
            control={control}
            render={({ field }) => (
              <MultiUpload
                label="Add Evidence"
                value={field.value}
                onChange={field.onChange}
                purpose={UploadPurposes.DISPUTE_EVIDENCE}
                onPreview={onPreview}
                maxFiles={5}
                autoCompress
                disabled={isSubmitting}
                onUploadingChange={mediaUploading}
              />
            )}
          />
        </div>
      </form>
    </div>
  );
}
