import { useEffect, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppModal } from '@/components/molecules/AppModal';
import { categorySchema, type CategoryFormData } from '../validation/categorySchema';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/handleApiError';
import type { Category } from '@/types/admin/category';
import { UploadPurposes } from '@/constants/upload';
import {
  BUFFER_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  PRICING_MODE,
  SERVICE_TYPE,
} from '@/constants';
import Select from '@/components/atoms/Select';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: CategoryFormData) => Promise<void>;
  category?: Category | null;
  parentCategory?: Category | null;
}

type Level3Errors = FieldErrors<Extract<CategoryFormData, { level: 3 }>>;

export function CategoryModal({
  open,
  onClose,
  onSubmit,
  category,
  parentCategory,
}: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const level = (category?.level ?? (parentCategory ? parentCategory.level + 1 : 1)) as 1 | 2 | 3;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    unregister,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      iconUrl: '',
      imageUrl: '',
      level,
      parentId: parentCategory ? parentCategory._id : null,
      platformFee: parentCategory?.platformFee ?? 1,
      isAvailable: true,
      baseRate: parentCategory?.baseRate ?? 0,

      ...(level === 3 && {
        rateDeviationPercent: 50,
        estimatedDuration: 60,
        bufferTime: 30,
        travelRatePerKM: parentCategory?.travelRatePerKM ?? 8,
        serviceType: SERVICE_TYPE.SMALL_TASK,
        pricingMode: PRICING_MODE.FIXED,
        allowBulkOffers: false,
        allowSuddenBooking: false,
      }),
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const level3Errors = errors as Level3Errors;
  const serviceType = watch('serviceType');
  const estimatedDuration = watch('estimatedDuration') ?? 0;
  const bufferTime = watch('bufferTime') ?? 0;

  const hourValue = Math.floor(estimatedDuration / 60).toString();
  const minuteValue = (estimatedDuration % 60).toString();
  const bufferHour = Math.floor(bufferTime / 60).toString();
  const bufferMinute = (bufferTime % 60).toString();

  useEffect(() => {
    if (level !== 3) {
      unregister([
        'serviceType',
        'pricingMode',
        'rateDeviationPercent',
        'estimatedDuration',
        'bufferTime',
        'travelRatePerKM',
        'allowBulkOffers',
        'allowSuddenBooking',
      ]);
    }
  }, [level, unregister]);

  useEffect(() => {
    if (level === 3) {
      reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
        iconUrl: category?.iconUrl ?? '',
        imageUrl: category?.imageUrl ?? '',
        level: 3,
        parentId: category?.parentId ?? parentCategory?._id ?? null,
        platformFee: category?.platformFee ?? parentCategory?.platformFee ?? 1,
        isAvailable: category?.isAvailable ?? true,
        baseRate: category?.baseRate ?? parentCategory?.baseRate ?? 0,

        serviceType: category?.serviceType ?? SERVICE_TYPE.SMALL_TASK,
        pricingMode: category?.pricingMode ?? PRICING_MODE.FIXED,
        rateDeviationPercent: category?.rateDeviationPercent ?? 50,
        estimatedDuration: category?.estimatedDuration ?? 60,
        bufferTime: category?.bufferTime ?? 30,
        travelRatePerKM: category?.travelRatePerKM ?? parentCategory?.travelRatePerKM ?? 8,
        allowBulkOffers: category?.allowBulkOffers ?? false,
        allowSuddenBooking: category?.allowSuddenBooking ?? false,
      });
    } else {
      reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
        iconUrl: category?.iconUrl ?? '',
        imageUrl: category?.imageUrl ?? '',
        level: level as 1 | 2,
        parentId: category?.parentId ?? parentCategory?._id ?? null,
        platformFee: category?.platformFee ?? parentCategory?.platformFee ?? 1,
        isAvailable: category?.isAvailable ?? true,
        baseRate: category?.baseRate ?? parentCategory?.baseRate ?? 0,
      });
    }
  }, [category, level, parentCategory, reset]);

  const onSubmitForm = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      onConfirm={handleSubmit(onSubmitForm)}
      confirmText={category ? 'Update' : 'Create'}
      cancelText="Cancel"
      isConfirmLoading={isLoading}
      canCloseOnOutsideClick={!isLoading}
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 w-full">
        <div>
          <Label>Category Name</Label>
          <Input
            placeholder="Enter your full name"
            className="px-3"
            error={errors.name?.message}
            {...register('name', {
              setValueAs: v => v.trim(),
            })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            {...register('description', {
              setValueAs: v => v.trim(),
            })}
            error={errors.description?.message}
          />
        </div>
        {level === 3 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Service Type</Label>
                <Select
                  placeholder="Select Service Type"
                  options={Object.values(SERVICE_TYPE).map(s => ({ label: s, value: s }))}
                  value={watch('serviceType')}
                  onChange={v => setValue('serviceType', v, { shouldValidate: true })}
                  error={level3Errors.serviceType?.message}
                />
              </div>
              <div>
                <Label>Pricing Type</Label>
                <Select
                  placeholder="Select Pricing Mode"
                  options={Object.values(PRICING_MODE).map(s => ({ label: s, value: s }))}
                  value={watch('pricingMode')}
                  onChange={v => setValue('pricingMode', v, { shouldValidate: true })}
                  error={level3Errors.pricingMode?.message}
                />
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Platform Fee (%)</Label>
            <Input
              min={'0'}
              type="number"
              className="px-4"
              {...register('platformFee', { valueAsNumber: true })}
              error={errors.platformFee?.message}
            />
          </div>
          <div>
            <Label>Base Rate</Label>
            <Input
              min={'0'}
              type="number"
              className="px-4"
              {...register('baseRate', { valueAsNumber: true })}
              error={errors.baseRate?.message}
            />
          </div>
        </div>

        {level === 3 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Travel Rate(Km)</Label>
                <Input
                  min={'0'}
                  type="number"
                  className="px-4"
                  {...register('travelRatePerKM', { valueAsNumber: true })}
                  error={level3Errors.travelRatePerKM?.message}
                />
              </div>
              <div>
                <Label>Min/Max Offer</Label>
                <Input
                  placeholder="Enter the rateDeviationPercent (in %)"
                  min={0}
                  type="number"
                  className="px-4"
                  {...register('rateDeviationPercent', { valueAsNumber: true })}
                  error={level3Errors.rateDeviationPercent?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Estimated Duration *</Label>
                <div className="flex gap-2">
                  <Select
                    placeholder="hour"
                    options={HOUR_OPTIONS}
                    value={hourValue}
                    onChange={v =>
                      setValue('estimatedDuration', Number(v) * 60 + (estimatedDuration % 60), {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Select
                    placeholder="minute"
                    value={minuteValue}
                    options={MINUTE_OPTIONS}
                    onChange={v =>
                      setValue(
                        'estimatedDuration',
                        Math.floor(estimatedDuration / 60) * 60 + Number(v),
                        { shouldValidate: true }
                      )
                    }
                  />
                </div>
                <p className="text-red-500 text-sm -mt-2">
                  {level3Errors?.estimatedDuration?.message}
                </p>
              </div>
              <div>
                <Label>Buffer Time</Label>
                <div className="flex gap-2">
                  <Select
                    placeholder="hour"
                    value={bufferHour}
                    options={BUFFER_OPTIONS}
                    onChange={v =>
                      setValue('bufferTime', Number(v) * 60 + (bufferTime % 60), {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Select
                    placeholder="minute"
                    value={bufferMinute}
                    options={MINUTE_OPTIONS}
                    onChange={v =>
                      setValue('bufferTime', Math.floor(bufferTime / 60) * 60 + Number(v), {
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                {level3Errors.bufferTime && (
                  <p className="text-red-500 text-sm -mt-2">{level3Errors.bufferTime.message}</p>
                )}
              </div>
            </div>
            {(serviceType === SERVICE_TYPE.REMOTE || serviceType === SERVICE_TYPE.SMALL_TASK) && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <Label>Allow Bulk Offers</Label>
                  <input
                    type="checkbox"
                    {...register('allowBulkOffers')}
                    className="h-5 w-5 text-indigo-600"
                  />
                  {level3Errors.allowBulkOffers && (
                    <p className="text-red-500 text-sm -mt-2">
                      {level3Errors.allowBulkOffers.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Allow Sudden Booking</Label>
                  <input
                    type="checkbox"
                    {...register('allowSuddenBooking')}
                    className="h-5 w-5 text-indigo-600"
                  />
                  {level3Errors.allowSuddenBooking && (
                    <p className="text-red-500 text-sm -mt-2">
                      {level3Errors.allowSuddenBooking.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="w-40">
            <Label>Category Icon</Label>
            <Controller
              name="iconUrl"
              rules={{
                validate: v => (v ? true : 'Category icon is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={url => field.onChange(url)}
                  error={fieldState.error?.message}
                  className="h-40"
                  purpose={UploadPurposes.CATEGORY_ICON}
                />
              )}
            />
          </div>
          <div className="w-40">
            <Label>Category Image</Label>
            <Controller
              name="imageUrl"
              rules={{
                validate: v => (v ? true : 'Category Image is required'),
              }}
              control={control}
              render={({ field, fieldState }) => (
                <ImageUpload
                  value={field.value}
                  onChange={url => field.onChange(url)}
                  error={fieldState.error?.message}
                  className="h-40 w-40"
                  purpose={UploadPurposes.CATEGORY_IMAGE}
                />
              )}
            />
          </div>
        </div>
      </form>
    </AppModal>
  );
}
