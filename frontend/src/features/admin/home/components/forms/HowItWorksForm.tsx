import { Controller, useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes, type HOME_SECTION_TYPE } from '@/constants';

import TitleSubtitleFields from './TitleSubtitleFields';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type HowItWorksValues = Extract<
  HomeSectionFormData,
  { type: typeof HOME_SECTION_TYPE.HOW_IT_WORKS }
>;

export default function HowItWorksForm() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<HowItWorksValues>();

  return (
    <div className="flex flex-col gap-6">
      <TitleSubtitleFields />
      {[0, 1, 2].map(index => (
        <div key={index} className="border p-4 rounded-lg space-y-3">
          <h4 className="flex items-center justify-center font-semibold">Step {index + 1} </h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  className="px-4"
                  {...register(`data.steps.${index}.title`)}
                  error={errors.data?.steps?.[index]?.title?.message}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  className="px-4"
                  {...register(`data.steps.${index}.description`)}
                  error={errors.data?.steps?.[index]?.description?.message}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <Label>Image</Label>
              <Controller
                name={`data.steps.${index}.imageUrl`}
                control={control}
                render={({ field, fieldState }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={url => field.onChange(url)}
                    error={fieldState.error?.message}
                    className="h-40"
                    purpose={UploadPurposes.HOME_HOW_IT_WORKS_IMAGE}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
