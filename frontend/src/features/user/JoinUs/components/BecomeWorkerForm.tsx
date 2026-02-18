import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, DollarSign } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes } from '@/constants/upload';

import { JoinWorkerSchema, type JoinWorkerSchemaType } from '../validation/JoinWorkerFormSchema';

interface BecomeWorkerFormType {
  onSubmit: (data: JoinWorkerSchemaType) => void;
  disabled?: boolean;
}

export default function BecomeWorkerForm({ onSubmit, disabled = false }: BecomeWorkerFormType) {
  const defaultValues: JoinWorkerSchemaType = {
    displayName: '',
    about: '',
    tagline: '',
    defaultRate: 0,
    document: '',
    experience: 0,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinWorkerSchemaType>({
    resolver: zodResolver(JoinWorkerSchema),
    defaultValues: defaultValues,
    reValidateMode: 'onChange',
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Professional Details */}
        <div className="bg-card  rounded-2xl shadow-sm p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Professional Details
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Display Name *</Label>
                <Input
                  placeholder="e.g., John's Plumbing Services"
                  className="px-3"
                  error={errors.displayName?.message}
                  {...register('displayName', {
                    setValueAs: v => v.trim(),
                  })}
                />
              </div>
              <div>
                <Label>Professional Tagline *</Label>
                <Input
                  placeholder="e.g., Expert Plumber with 10+ Years Experience"
                  className="px-3"
                  error={errors.tagline?.message}
                  {...register('tagline', {
                    setValueAs: v => v.trim(),
                  })}
                />
              </div>
            </div>
            <div>
              <Label>About You *</Label>
              <Textarea
                placeholder="Tell us about your experience, expertise, and what makes you stand out..."
                className="min-h-32"
                error={errors.about?.message}
                {...register('about', {
                  setValueAs: v => v.trim(),
                })}
              />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Service Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Id Profe *</Label>
              <Controller
                name="document"
                control={control}
                render={({ field, fieldState }) => (
                  <ImageUpload
                    value={field.value}
                    isEditable={!disabled}
                    onChange={url => field.onChange(url)}
                    purpose={UploadPurposes.WORKER_DOCUMENT}
                    error={fieldState.error?.message}
                    className="w-full mt-2"
                  />
                )}
              />
            </div>
            <div>
              <div>
                <Label>Service Experience *</Label>
                <Input
                  type="number"
                  placeholder="Enter experience in years"
                  className="px-3"
                  error={errors.experience?.message}
                  {...register('experience', { valueAsNumber: true })}
                />
              </div>
              <Label>Service Rate Amount *</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="px-3"
                error={errors.defaultRate?.message}
                {...register('defaultRate', { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              variant="blue"
              loading={isSubmitting}
              disabled={disabled || isSubmitting}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
