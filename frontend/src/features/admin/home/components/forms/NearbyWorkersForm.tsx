import { useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import type { HOME_SECTION_TYPE } from '@/constants';

import TitleSubtitleFields from './TitleSubtitleFields';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type NearbyWorkersValues = Extract<
  HomeSectionFormData,
  { type: typeof HOME_SECTION_TYPE.NEARBY_WORKERS }
>;

export default function NearbyWorkersForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<NearbyWorkersValues>();

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
        <div>
          <Label>radius (km)</Label>
          <Input
            type="number"
            className="px-4"
            {...register('data.radiusKm', { valueAsNumber: true })}
            placeholder="e.g. 5"
            error={errors.data?.radiusKm?.message}
          />
        </div>
      </div>
    </div>
  );
}
