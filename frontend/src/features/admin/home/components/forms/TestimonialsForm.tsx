import { Controller, useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes, type HOME_SECTION_TYPE } from '@/constants';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type TestimonialsValues = Extract<
  HomeSectionFormData,
  { type: typeof HOME_SECTION_TYPE.TESTIMONIALS }
>;

export default function TestimonialsForm() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<TestimonialsValues>();

  const ratingOptions = [1, 2, 3, 4, 5].map(n => ({
    label: `${n} ${'⭐'.repeat(n)}`,
    value: n.toString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label>Title</Label>
          <Input
            {...register('data.title')}
            className="px-4"
            error={errors.data?.title?.message}
            placeholder="Please Enter Title"
          />
        </div>
      </div>
      {[0, 1, 2].map(index => (
        <div key={index} className="border p-5 rounded-xl space-y-4">
          <h4 className="font-semibold text-center">Testimonial {index + 1}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                className="px-4"
                {...register(`data.items.${index}.name`)}
                error={errors.data?.items?.[index]?.name?.message}
              />
            </div>

            <div>
              <Label>Service</Label>
              <Input
                className="px-4"
                {...register(`data.items.${index}.service`)}
                error={errors.data?.items?.[index]?.service?.message}
              />
            </div>
          </div>
          <div>
            <Label>Comment</Label>
            <Textarea
              className="px-4"
              {...register(`data.items.${index}.comment`)}
              error={errors.data?.items?.[index]?.comment?.message}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <div>
                <Label>Rating</Label>
                <Controller
                  name={`data.items.${index}.rating`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      value={field.value?.toString() ?? ''}
                      onChange={v => field.onChange(Number(v))}
                      error={fieldState.error?.message}
                      options={ratingOptions}
                    />
                  )}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  {...register(`data.items.${index}.date`)}
                  className="px-3"
                  placeholder="e.g. 2 weeks ago"
                  error={errors.data?.items?.[index]?.date?.message}
                />
              </div>
            </div>

            <div className="sm:col-span-5">
              <Label>Image</Label>
              <Controller
                name={`data.items.${index}.imageUrl`}
                rules={{
                  validate: v => (v ? true : 'Image is required'),
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    className="h-36"
                    purpose={UploadPurposes.HOME_TESTIMONIAL_IMAGE}
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
