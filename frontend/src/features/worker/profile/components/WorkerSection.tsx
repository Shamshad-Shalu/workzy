import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import type { WorkerProfile } from '@/types/worker';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, type ControllerRenderProps } from 'react-hook-form';
import {
  workerProfileSchema,
  type WorkerProfileSchemaType,
} from '../validation/workerProfileSchema';
import { useAvailability } from '../../hooks/useAvailability';
import { AvailabilitySection } from '../../components/AvailabilitySection';
import { TagManager } from '@/components/molecules/TagManager';
import { LocationSearchModal } from '@/components/molecules/LocationSearchModal';
import { toast } from 'sonner';
import { UploadPurposes } from '@/constants/upload';

interface WorkerSectionProps {
  workerData: WorkerProfile;
  onSubmit: (data: WorkerProfileSchemaType) => Promise<void>;
}

export default function WorkerSection({ workerData, onSubmit }: WorkerSectionProps) {
  const { addSlot, updateSlot, removeSlot } = useAvailability();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

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
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    reset(workerData as unknown as WorkerProfileSchemaType);
  }, [reset, workerData]);

  function findErrorMessage(err: unknown): string | null {
    if (typeof err !== 'object' || err === null) {
      return null;
    }
    if ('message' in err && typeof (err as { message?: unknown }).message === 'string') {
      return (err as { message: string }).message;
    }
    for (const value of Object.values(err as Record<string, unknown>)) {
      const msg = findErrorMessage(value);
      if (msg) {
        return msg;
      }
    }
    return null;
  }

  useEffect(() => {
    if (!errors.availability) {
      return;
    }
    const message = findErrorMessage(errors.availability);
    if (message) {
      toast.error(message);
    }
  }, [errors.availability]);

  const handleFormSubmit = async (data: WorkerProfileSchemaType) => {
    await onSubmit(data);
    setIsEditing(false);
  };

  const handleLocationSelect = (
    location: string,
    field: ControllerRenderProps<WorkerProfileSchemaType, 'cities'>
  ) => {
    const currentCities = field.value || [];
    if (!currentCities.includes(location)) {
      field.onChange([...currentCities, location]);
    }
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
                    disabled={isImageUploading}
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
                    disabled={isImageUploading || isSubmitting}
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
                  <>
                    <TagManager
                      label="Town Cities"
                      items={field.value}
                      isEditing={isEditing}
                      max={8}
                      error={errors.cities?.message}
                      onAdd={() => setLocationModalOpen(true)}
                      onRemove={city => {
                        field.onChange(field.value.filter(s => s !== city));
                      }}
                      className="bg-section-blue border-section-blue-border"
                    />
                    <LocationSearchModal
                      open={locationModalOpen}
                      onClose={() => setLocationModalOpen(false)}
                      onSelectLocation={location => handleLocationSelect(location, field)}
                      title="Add City"
                      description="Search and select a city"
                    />
                  </>
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
                      onChange={url => field.onChange(url)}
                      error={fieldState.error?.message}
                      className="w-full mt-2"
                      isEditable={isEditing}
                      purpose={UploadPurposes.WORKER_COVER_IMAGE}
                      onUploadingChange={setIsImageUploading}
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
              render={({ field, fieldState }) => (
                <AvailabilitySection
                  availability={field.value}
                  isEditing={isEditing}
                  hasError={!!fieldState.error}
                  onAddSlot={day => {
                    field.onChange(addSlot(field.value, day));
                  }}
                  onUpdateSlot={(day, index, fieldName, value) => {
                    field.onChange(updateSlot(field.value, day, index, fieldName, value));
                  }}
                  onRemoveSlot={(day, index) => {
                    field.onChange(removeSlot(field.value, day, index));
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
