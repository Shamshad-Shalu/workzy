import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import type { WorkerProfile } from '@/types/worker';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  workerProfileSchema,
  type WorkerProfileSchemaType,
} from '../validation/workerProfileSchema';
import { useAvailability } from '../../hooks/useAvailability';
import { AvailabilitySection } from '../../components/AvailabilitySection';
import { TagManager } from '@/components/molecules/TagManager';

interface WorkerSectionProps {
  workerData: WorkerProfile;
  onSubmit: (data: WorkerProfileSchemaType) => Promise<void>;
}

export default function WorkerSection({ workerData, onSubmit }: WorkerSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: availability,
    addSlot,
    updateSlot,
    removeSlot,
  } = useAvailability(workerData.availability);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WorkerProfileSchemaType>({
    resolver: zodResolver(workerProfileSchema),
    defaultValues: workerData as unknown as WorkerProfileSchemaType,
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    setValue('availability', availability, { shouldValidate: false, shouldDirty: true });
  }, [availability, setValue]);

  const handleFormSubmit = async (data: WorkerProfileSchemaType) => {
    await onSubmit(data);
    setIsEditing(false);
  };

  return (
    <div className="pt-2 mt-6">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Professional Profile</h3>
            <div>
              {!isEditing ? (
                <Button
                  iconRight={<Pencil size={18} />}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  type="button"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    iconRight={<X size={18} />}
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset(workerData as unknown as WorkerProfileSchemaType);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="green"
                    iconRight={<Save size={19} />}
                    type="submit"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* leftsection  */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <Label>Display Name</Label>
                {isEditing ? (
                  <Input
                    placeholder="Enter Display name"
                    className="px-3"
                    error={errors.displayName?.message}
                    {...register('displayName', {
                      setValueAs: v => v.trim(),
                    })}
                  />
                ) : (
                  <div className="text-lg font-semibold text-card-foreground py-2">
                    {workerData.displayName}
                  </div>
                )}
              </div>
              <div>
                <Label>tagline </Label>
                {isEditing ? (
                  <Input
                    placeholder="Enter Display name"
                    className="px-3"
                    error={errors.tagline?.message}
                    {...register('tagline', {
                      setValueAs: v => v.trim(),
                    })}
                  />
                ) : (
                  <div className="text-lg font-semibold text-card-foreground py-2">
                    {workerData.tagline}
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div>
                    <Label>About You</Label>
                    <Textarea
                      placeholder="Something About you"
                      error={errors.about?.message}
                      {...register('about', {
                        setValueAs: v => v.trim(),
                      })}
                    />
                  </div>
                ) : (
                  <div className=" p-4 rounded-lg border-l-3 pl-4 rounded-lg p-4 bg-section-blue border-section-blue-border">
                    <Label>About You</Label>
                    <div className="text-card-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {workerData.about}
                    </div>
                  </div>
                )}
              </div>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <TagManager
                    label="Specialties"
                    items={field.value ?? []}
                    error={errors.skills?.message}
                    isEditing={isEditing}
                    onAdd={() => {
                      const newSkill = 'Plumbing';
                      field.onChange([...(field.value ?? []), newSkill]);
                    }}
                    onRemove={skill => {
                      field.onChange(field.value.filter(s => s !== skill));
                    }}
                    className="bg-section-blue border-section-blue-border"
                  />
                )}
              />

              <Controller
                name="cities"
                control={control}
                render={({ field }) => (
                  <TagManager
                    label="Town Cities"
                    items={field.value}
                    isEditing={isEditing}
                    max={8}
                    error={errors.cities?.message}
                    onAdd={() => {
                      const newSkill = 'Malappuram';
                      field.onChange([...field.value, newSkill]);
                    }}
                    onRemove={skill => {
                      field.onChange(field.value.filter(s => s !== skill));
                    }}
                    className="bg-section-blue border-section-blue-border"
                  />
                )}
              />
            </div>
            {/* rightsection  */}
            <div className="space-y-6">
              <div>
                <Label>Professional Image</Label>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={file => field.onChange(file)}
                      error={fieldState.error?.message}
                      className="w-full mt-2"
                      isEditable={isEditing}
                    />
                  )}
                />
              </div>
              <div>
                {isEditing ? (
                  <div>
                    <Label>Service Amount</Label>

                    <Input
                      className="p-3"
                      type="number"
                      placeholder="Enter amount"
                      error={errors.defaultRate?.amount?.message}
                      {...register('defaultRate.amount', { valueAsNumber: true })}
                    />
                    <Label>Service Type</Label>
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
                ) : (
                  <div className="border-l-3 pl-4 rounded-lg  p-4 bg-section-blue border-section-blue-border">
                    <Label>Service Rate</Label>

                    <div className="text-center">
                      <div className="text-3xl font-bold">₹{workerData.defaultRate.amount}</div>
                      <div className="text-xs mt-1 text-muted-baground">
                        per {workerData.defaultRate.type === 'fixed' ? 'day' : 'hour'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm p-8 border border-border mt-6">
          <h3 className="text-xl font-bold text-foreground">Availability Schedule</h3>

          <div className="mt-6">
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <AvailabilitySection
                  error={errors.availability?.message}
                  availability={field.value ?? availability}
                  isEditing={isEditing}
                  onAddSlot={day => {
                    addSlot(day);
                    setValue('availability', availability, { shouldValidate: false });
                  }}
                  onUpdateSlot={(d, i, t, v) => {
                    updateSlot(d, i, t, v);
                    setValue('availability', availability, { shouldValidate: false });
                  }}
                  onRemoveSlot={(day, index) => {
                    removeSlot(day, index);
                    setValue('availability', availability, { shouldValidate: false });
                  }}
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
