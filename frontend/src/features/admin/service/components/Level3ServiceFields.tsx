import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import SlotTimeInput from '@/components/molecules/SlotTimeInput';
import { PRICING_MODE, SERVICE_TYPE, type ServiceType } from '@/constants';

import type { CategoryFormData } from '../validation/categorySchema';
import type { FieldErrors, UseFormReturn } from 'react-hook-form';

interface Level3ServiceFieldsProps {
  form: UseFormReturn<CategoryFormData>;
  serviceType: ServiceType | undefined;
  estimatedDuration: number;
  bufferTime: number;
}
type Level3Errors = FieldErrors<Extract<CategoryFormData, { level: 3 }>>;

export function Level3ServiceFields({
  form,
  bufferTime,
  estimatedDuration,
  serviceType,
}: Level3ServiceFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const level3Errors = errors as Level3Errors;

  return (
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
        <SlotTimeInput
          label="Estimated Duration *"
          valueInMinutes={estimatedDuration}
          onChange={v => setValue('estimatedDuration', v, { shouldValidate: true })}
          error={level3Errors?.estimatedDuration?.message}
        />
        <SlotTimeInput
          label="Buffer Time"
          valueInMinutes={bufferTime}
          onChange={v => setValue('bufferTime', v, { shouldValidate: true })}
          error={level3Errors?.bufferTime?.message}
          isBuffer
        />
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
              <p className="text-red-500 text-sm -mt-2">{level3Errors.allowBulkOffers.message}</p>
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
  );
}
