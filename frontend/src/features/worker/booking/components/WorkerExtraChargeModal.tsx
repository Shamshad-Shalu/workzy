import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCheck, Clock, ImageIcon, Upload, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AppModal } from '@/components/molecules/AppModal';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import { cn } from '@/lib/utils';
import { uploadToS3 } from '@/services/upload.service';

import { ExtraChargeSchema, type ExtraChargeFormType } from '../validation/extraChargeSchema';

interface WorkerExtraChargeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExtraChargeFormType) => Promise<void>;
  bookingId: string | null;
  isSubmitting?: boolean;
}

export default function WorkerExtraChargeModal({
  open,
  onClose,
  onSubmit,
  bookingId,
  isSubmitting = false,
}: WorkerExtraChargeModalProps) {
  const form = useForm<ExtraChargeFormType>({
    resolver: zodResolver(ExtraChargeSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '',
      amount: 0,
      evidenceUrl: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { booking } = useBookingDetails(bookingId);

  const isViewOnly = !!booking?.extraCharge;

  useEffect(() => {
    if (!open) {
      reset({ reason: '', amount: 0, evidenceUrl: '' });
      setEvidenceFile(null);
    } else if (booking?.extraCharge) {
      reset({
        reason: booking.extraCharge.reason,
        amount: booking.extraCharge.amount,
        evidenceUrl: booking.extraCharge.evidenceUrl || '',
      });
    }
  }, [open, booking, reset]);

  if (!booking) {
    return null;
  }

  const onFormSubmit = async (data: ExtraChargeFormType) => {
    if (isViewOnly) {
      return;
    }
    setUploading(true);
    try {
      let finalEvidenceUrl = data.evidenceUrl;
      if (evidenceFile) {
        finalEvidenceUrl = await uploadToS3({ file: evidenceFile, purpose: 'SERVICE_EVIDENCE' });
      }
      await onSubmit({
        amount: data.amount,
        reason: data.reason as string,
        evidenceUrl: finalEvidenceUrl || undefined,
      });
    } catch (err) {
      toast.error('Failed to upload evidence');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" disabled={isSubmitting || uploading} onClick={onClose}>
        {isViewOnly ? 'Close' : 'Cancel'}
      </Button>
      {!isViewOnly && (
        <Button
          variant="warning"
          disabled={isSubmitting || uploading}
          onClick={handleSubmit(onFormSubmit)}
          loading={isSubmitting || uploading}
        >
          Request Extra Charge
        </Button>
      )}
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isViewOnly ? 'Extra Charge Request' : 'Request Extra Charge'}
      canCloseOnOutsideClick={!isSubmitting && !uploading}
      className="max-w-lg"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {isViewOnly ? (
          <div
            className={cn(
              'flex items-center gap-2 p-3 rounded-xl border mb-2',
              booking.extraCharge?.status === 'approved'
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : booking.extraCharge?.status === 'rejected'
                  ? 'bg-red-500/10 text-red-600 border-red-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
            )}
          >
            {booking.extraCharge?.status === 'approved' ? (
              <CheckCheck size={16} />
            ) : booking.extraCharge?.status === 'rejected' ? (
              <XCircle size={16} />
            ) : (
              <Clock size={16} />
            )}
            <span className="text-sm font-semibold capitalize">
              Status: {booking.extraCharge?.status}
            </span>
          </div>
        ) : (
          <div className="flex gap-3 p-3 rounded-xl border bg-amber-500/15 text-amber-500 border-amber-500/30">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Extra charges must be reviewed and approved by the client.{' '}
              <strong>Minimum amount is ₹60</strong> (Stripe requirement). Provide a clear reason
              and evidence.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label>Amount (₹)</Label>
          <Input
            className="px-3"
            type="number"
            placeholder="Enter amount"
            disabled={isSubmitting || uploading || isViewOnly}
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Reason</Label>
          <Textarea
            placeholder="Briefly explain why this extra charge is needed..."
            disabled={isSubmitting || uploading || isViewOnly}
            error={errors.reason?.message}
            {...register('reason')}
          />
        </div>

        {(evidenceFile || booking.extraCharge?.evidenceUrl) && (
          <div className="flex flex-col gap-1.5">
            <Label>Evidence</Label>
            {isViewOnly ? (
              <a
                href={booking.extraCharge?.evidenceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1.5"
              >
                <ImageIcon size={14} />
                View Uploaded Receipt
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('extra-evidence')?.click()}
                  iconLeft={<Upload size={14} />}
                  disabled={isSubmitting || uploading}
                >
                  {evidenceFile ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <input
                  id="extra-evidence"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setEvidenceFile(e.target.files?.[0] || null)}
                />
                {evidenceFile && (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {evidenceFile.name}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {!isViewOnly && !evidenceFile && (
          <div className="flex flex-col gap-1.5">
            <Label>Evidence (Optional Receipt/Photo)</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('extra-evidence')?.click()}
                iconLeft={<Upload size={14} />}
                disabled={isSubmitting || uploading}
              >
                Upload Photo
              </Button>
              <input
                id="extra-evidence"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setEvidenceFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        )}
      </div>
    </AppModal>
  );
}
