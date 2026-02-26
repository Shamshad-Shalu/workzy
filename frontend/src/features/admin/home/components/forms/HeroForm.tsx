import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Switch } from '@/components/ui/switch';
import { HOME_SECTION_TYPE } from '@/constants';
import CategoryService from '@/services/category.service';

import { SectionCard } from './SectionCard';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type HeroFormValues = Extract<HomeSectionFormData, { type: typeof HOME_SECTION_TYPE.HERO }>;

export default function HeroForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext<HeroFormValues>();
  const { fields, append, remove } = useFieldArray<HeroFormValues, 'data.slides'>({
    control,
    name: 'data.slides',
  });

  const { data: level1Options = [] } = useQuery({
    queryKey: ['categories', 'level1'],
    queryFn: () => CategoryService.getCategoryLevels(1, null),
    select: data => data.map(c => ({ label: c.name, value: c.id })),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <div>
      <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
        <div className="flex items-center gap-2.5">
          <Switch
            checked={watch('data.autoPlay')}
            onCheckedChange={v => setValue('data.autoPlay', v)}
            id="autoplay"
          />
          <label htmlFor="autoplay" className="text-sm font-medium cursor-pointer">
            Auto-play
          </label>
        </div>
        <div>
          <Label>Interval (seconds)</Label>
          <Input
            type="number"
            className="px-4"
            {...register('data.interval', {
              valueAsNumber: true,
              setValueAs: v => Number(v) * 1000,
            })}
            placeholder="e.g. 5"
            error={errors.data?.interval?.message}
          />
        </div>
        {/* )} */}
      </div>
      <div className="flex flex-col gap-3">
        {fields.map((field, i) => (
          <SectionCard
            key={field.id}
            label={`Slide `}
            index={i}
            canRemove={fields.length > 1}
            onRemove={() => remove(i)}
          >
            <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select
                  placeholder="Select Category"
                  options={level1Options}
                  value={watch(`data.slides.${i}.categoryId`)}
                  onChange={v =>
                    setValue(`data.slides.${i}.categoryId`, v, { shouldValidate: true })
                  }
                  error={errors.data?.slides?.[i]?.categoryId?.message}
                />
              </div>
              <div>
                <Label>Eyebrow</Label>
                <Input
                  className="px-4"
                  {...register(`data.slides.${i}.eyebrow`)}
                  error={errors.data?.slides?.[i]?.eyebrow?.message}
                  placeholder="eg(Home Services)"
                />
              </div>
            </div>
            <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  className="px-4"
                  {...register(`data.slides.${i}.title`)}
                  error={errors.data?.slides?.[i]?.title?.message}
                  placeholder="Please Enter Title"
                />
              </div>
              <div>
                <Label>Sub Title </Label>
                <Input
                  className="px-4"
                  {...register(`data.slides.${i}.subTitle`)}
                  error={errors.data?.slides?.[i]?.subTitle?.message}
                  placeholder="Please Enter subTitle"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter Description"
                {...register(`data.slides.${i}.description`)}
                error={errors.data?.slides?.[i]?.description?.message}
              />
            </div>
          </SectionCard>
        ))}
        {fields.length < 5 && (
          <Button
            type="button"
            className="mt-5 "
            onClick={() =>
              append({
                categoryId: '',
                eyebrow: '',
                title: '',
                subTitle: '',
                description: '',
              })
            }
          >
            Add Slide
          </Button>
        )}
      </div>
    </div>
  );
}
