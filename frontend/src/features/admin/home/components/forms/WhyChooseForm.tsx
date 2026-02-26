import { Controller, useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes, WHY_CHOOSE_ICON, type HOME_SECTION_TYPE } from '@/constants';

import TitleSubtitleFields from './TitleSubtitleFields';

import type { HomeSectionFormData } from '../../validation/section-schemas';


type WhyChooseValues = Extract<HomeSectionFormData, { type: typeof HOME_SECTION_TYPE.WHY_CHOOSE }>;

const iconOptions = Object.values(WHY_CHOOSE_ICON).map(icon => ({
  label: icon,
  value: icon,
}));

export default function WhyChooseForm() {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<WhyChooseValues>();

  return (
    <div className="flex flex-col gap-6">
      <TitleSubtitleFields />
      {[0, 1, 2, 3].map(index => (
        <div key={index} className="border p-5 rounded-xl space-y-4">
          <h4 className="font-semibold text-center">Item {index + 1}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                className="px-3"
                placeholder="eg:(Quick Response)"
                {...register(`data.items.${index}.title`)}
                error={errors.data?.items?.[index]?.title?.message}
              />
            </div>

            <div>
              <Label>Icon</Label>
              <Select
                options={iconOptions}
                value={watch(`data.items.${index}.icon`)}
                onChange={v =>
                  setValue(`data.items.${index}.icon`, v, {
                    shouldValidate: true,
                  })
                }
                error={errors.data?.items?.[index]?.icon?.message}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 space-y-5">
            <div className="sm:col-span-7">
              <div>
                <Label>Stat</Label>
                <Input
                  className="px-3"
                  placeholder=" eg(<30 min).."
                  {...register(`data.items.${index}.stat`)}
                  error={errors.data?.items?.[index]?.stat?.message}
                />
              </div>
              <div className="mt-1">
                <Label>Description</Label>
                <Textarea
                  {...register(`data.items.${index}.description`)}
                  error={errors.data?.items?.[index]?.description?.message}
                />
              </div>
            </div>

            <div className="sm:col-span-5">
              <Label>Image</Label>
              <Controller
                name={`data.items.${index}.imageUrl`}
                control={control}
                render={({ field, fieldState }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    className="h-36"
                    purpose={UploadPurposes.HOME_WHY_CHOOSE_IMAGE}
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
