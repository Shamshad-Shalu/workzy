import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Briefcase, DollarSign } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { JoinWorkerSchema, type JoinWorkerSchemaType } from '../validation/JoinWorkerFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';

interface BecomeWorkerFormType {
  onSubmit: (data: any) => void;
  disabled?: boolean;
}

export default function BecomeWorkerForm({ onSubmit, disabled = false }: BecomeWorkerFormType) {
  const defaultValues: JoinWorkerSchemaType = {
    displayName: '',
    about: '',
    tagline: '',
    defaultRate: {
      type: 'fixed',
      amount: 0,
    },
    document: '',
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
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
                    onChange={file => field.onChange(file)}
                    error={fieldState.error?.message}
                    className="w-full mt-2"
                    isEditable
                  />
                )}
              />
            </div>
            <div>
              <Label>Service Rate Amount *</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                className="px-3"
                error={errors.defaultRate?.amount?.message}
                {...register('defaultRate.amount', { valueAsNumber: true })}
              />
              <Label>Rate Type *</Label>
              <Select
                placeholder="Select Type"
                value={watch('defaultRate.type')}
                onChange={v => setValue('defaultRate.type', v as 'hourly' | 'fixed')}
                error={errors.defaultRate?.type?.message}
                options={[
                  { label: 'Per Hour', value: 'hourly' },
                  { label: 'Fixed Rate', value: 'fixed' },
                ]}
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
