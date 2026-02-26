import { useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import type { HOME_SECTION_TYPE } from '@/constants';

import TitleSubtitleFields from './TitleSubtitleFields';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type TopServicesValues = Extract<
  HomeSectionFormData,
  { type: typeof HOME_SECTION_TYPE.TOP_SERVICES }
>;

export default function TopServicesForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TopServicesValues>();

  return (
    <div className="space-y-5">
      <TitleSubtitleFields />
      <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label>Limit</Label>
          <Input
            type="number"
            className="px-4"
            {...register('data.limit', { valueAsNumber: true })}
            placeholder="e.g. 5"
            error={errors.data?.limit?.message}
          />
        </div>
      </div>
    </div>
  );
}
