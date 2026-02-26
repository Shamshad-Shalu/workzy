import { useQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import type { HOME_SECTION_TYPE } from '@/constants';
import CategoryService from '@/services/category.service';

import TitleSubtitleFields from './TitleSubtitleFields';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type CategoryShowcaseValues = Extract<
  HomeSectionFormData,
  { type: typeof HOME_SECTION_TYPE.CATEGORY_SHOWCASE }
>;

export default function CategoryShowcaseForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CategoryShowcaseValues>();

  const { data: level1Options = [] } = useQuery({
    queryKey: ['categories', 'level1'],
    queryFn: () => CategoryService.getCategoryLevels(1, null),
    select: data => data.map(c => ({ label: c.name, value: c.id })),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <div className="space-y-5">
      <TitleSubtitleFields />
      <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select
            placeholder="Select Category"
            options={level1Options}
            value={watch(`data.categoryId`)}
            onChange={v => setValue(`data.categoryId`, v, { shouldValidate: true })}
            error={errors.data?.categoryId?.message}
          />
        </div>
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
