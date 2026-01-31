import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';

import type { CategoryFormData } from '../validation/categorySchema';
import type { UseFormReturn } from 'react-hook-form';

interface CategoryBasicInfoProps {
  form: UseFormReturn<CategoryFormData>;
}

export function CategoryBasicFields({ form }: CategoryBasicInfoProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
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
    </>
  );
}
