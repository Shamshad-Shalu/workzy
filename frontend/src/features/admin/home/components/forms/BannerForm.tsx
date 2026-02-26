import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { UploadPurposes, type HOME_SECTION_TYPE } from '@/constants';
import CategoryService from '@/services/category.service';

import type { HomeSectionFormData } from '../../validation/section-schemas';

type BannerFormValues = Extract<HomeSectionFormData, { type: typeof HOME_SECTION_TYPE.BANNER }>;

export default function BannerForm() {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<BannerFormValues>();

  const selectedL2Id = watch('data.categoryId') ?? '';
  const [level1Id, setLevel1Id] = useState<string>('');

  const { data: l1Options = [] } = useQuery({
    queryKey: ['categories', 'level1'],
    queryFn: () => CategoryService.getCategoryLevels(1, null),
    select: data => data.map(c => ({ label: c.name, value: c.id })),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const fetchAncestors = async () => {
      if (!selectedL2Id) {return;}
      try {
        const ancestors = await CategoryService.getCategoryAncestors(selectedL2Id);
        const l1 = ancestors.find(a => a.level === 1);
        if (l1?.id) {
          setLevel1Id(l1.id);
        }
      } catch (error) {
        console.error('Failed to fetch category ancestors:', error);
      }
    };
    fetchAncestors();
  }, [selectedL2Id]);

  const { data: l2Options = [] } = useQuery({
    queryKey: ['categories', 'level2', level1Id],
    queryFn: () => CategoryService.getCategoryLevels(2, level1Id),
    enabled: !!level1Id,
    select: data => data.map(c => ({ label: c.name, value: c.id })),
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <Label>Category</Label>
          <Select
            value={level1Id}
            onChange={v => setLevel1Id(v)}
            options={l1Options}
            placeholder="Select Level 1"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            placeholder="Select Category"
            options={l2Options}
            value={watch(`data.categoryId`)}
            onChange={v => setValue(`data.categoryId`, v, { shouldValidate: true })}
            error={errors.data?.categoryId?.message}
          />
        </div>
      </div>
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
        <div>
          <Label>ctaText</Label>
          <Input
            {...register('data.ctaText')}
            className="px-3"
            placeholder="e.g. Explore Now"
            error={errors.data?.ctaText?.message}
          />
        </div>
      </div>
      <div>
        <Label>Comment</Label>
        <Textarea
          className="px-4"
          {...register('data.description')}
          error={errors.data?.description?.message}
        />
      </div>
      <div>
        <div className="">
          <Label>Image</Label>
          <Controller
            name={'data.imageUrl'}
            control={control}
            render={({ field, fieldState }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                className="h-36"
                purpose={UploadPurposes.HOME_BANNER_IMAGE}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
