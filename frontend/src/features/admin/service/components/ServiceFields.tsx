import { type FieldErrors, type UseFormReturn } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import SlotTimeInput from '@/components/molecules/SlotTimeInput';
import { PRICING_MODE, SERVICE_TYPE, type ServiceType } from '@/constants';

import type { CategoryFormData } from '../validation/categorySchema';

interface ServiceFieldsProps {
  form: UseFormReturn<CategoryFormData>;
  serviceType: ServiceType | undefined;
  estimatedDuration: number;
  bufferTime: number;
}
type ServiceErrors = FieldErrors<Extract<CategoryFormData, { level: 2 }>>;

export function ServiceFields({
  form,
  bufferTime,
  estimatedDuration,
  serviceType,
}: ServiceFieldsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const serviceErrors = errors as ServiceErrors;
  const pricingMode = watch('pricingMode');

  const isPricingModeDisabled =
    serviceType === SERVICE_TYPE.CONSULTATION || serviceType === SERVICE_TYPE.INSPECTION;

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
            error={serviceErrors.serviceType?.message}
          />
        </div>
        <div>
          <Label>Pricing Type</Label>
          <Select
            placeholder="Select Pricing Mode"
            options={Object.values(PRICING_MODE).map(s => ({ label: s, value: s }))}
            value={watch('pricingMode')}
            onChange={v => setValue('pricingMode', v, { shouldValidate: true })}
            disabled={isPricingModeDisabled}
            error={serviceErrors.pricingMode?.message}
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
            error={serviceErrors.travelRatePerKM?.message}
          />
        </div>
        <div>
          <Label>Price Variance Limit</Label>
          <Input
            placeholder="Enter the priceVarianceLimit (in %)"
            min={0}
            type="number"
            className="px-4"
            {...register('priceVarianceLimit', { valueAsNumber: true })}
            error={serviceErrors.priceVarianceLimit?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <SlotTimeInput
          label="Estimated Duration *"
          valueInMinutes={estimatedDuration}
          onChange={v => setValue('estimatedDuration', v, { shouldValidate: true })}
          error={serviceErrors?.estimatedDuration?.message}
        />
        <SlotTimeInput
          label="Buffer Time"
          valueInMinutes={bufferTime}
          onChange={v => setValue('bufferTime', v, { shouldValidate: true })}
          error={serviceErrors?.bufferTime?.message}
          isBuffer
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {serviceType === SERVICE_TYPE.SMALL_TASK && pricingMode !== PRICING_MODE.FIXED && (
          <div>
            <Label>Allow Bulk Offers</Label>
            <input
              type="checkbox"
              {...register('allowBulkOffers')}
              className="h-5 w-5 text-indigo-600"
            />
            {serviceErrors.allowBulkOffers && (
              <p className="text-red-500 text-sm -mt-2">{serviceErrors.allowBulkOffers.message}</p>
            )}
          </div>
        )}
        {(serviceType === SERVICE_TYPE.SMALL_TASK || serviceType === SERVICE_TYPE.INSPECTION) && (
          <div>
            <Label>Allow Sudden Booking</Label>
            <input
              type="checkbox"
              {...register('allowSuddenBooking')}
              className="h-5 w-5 text-indigo-600"
            />
            {serviceErrors.allowSuddenBooking && (
              <p className="text-red-500 text-sm -mt-2">
                {serviceErrors.allowSuddenBooking.message}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
