import { Controller, type UseFormReturn } from 'react-hook-form';

import Label from '@/components/atoms/Label';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes } from '@/constants/upload';

import type { CategoryFormData } from '../validation/categorySchema';

interface Props {
  form: UseFormReturn<CategoryFormData>;
}

export function CategoryImageFields({ form }: Props) {
  const { control } = form;

  return (
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
  );
}
