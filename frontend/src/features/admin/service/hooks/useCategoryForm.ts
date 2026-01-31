import type { Category } from '@/types/admin/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { PRICING_MODE, SERVICE_TYPE } from '@/constants';
import { categorySchema, type CategoryFormData } from '../validation/categorySchema';
import { useForm } from 'react-hook-form';

type UseCategoryFormProps = {
  category?: Category | null;
  parentCategory?: Category | null;
};

export function useCategoryForm({ category, parentCategory }: UseCategoryFormProps) {
  const level = useMemo(
    () => (category?.level ?? (parentCategory ? parentCategory.level + 1 : 1)) as 1 | 2 | 3,
    [category, parentCategory]
  );
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      iconUrl: '',
      imageUrl: '',
      level,
      parentId: parentCategory?.id ?? null,
      platformFee: parentCategory?.platformFee ?? 1,
      baseRate: parentCategory?.baseRate ?? 0,
      isAvailable: true,
      ...(level === 3 && {
        serviceType: SERVICE_TYPE.SMALL_TASK,
        pricingMode: PRICING_MODE.FIXED,
        rateDeviationPercent: 50,
        estimatedDuration: 60,
        bufferTime: 30,
        travelRatePerKM: parentCategory?.travelRatePerKM ?? 8,
        allowBulkOffers: false,
        allowSuddenBooking: false,
      }),
    },
  });

  const { reset, watch, unregister } = form;

  const serviceType = watch('serviceType');
  const estimatedDuration = watch('estimatedDuration') ?? 0;
  const bufferTime = watch('bufferTime') ?? 0;

  useEffect(() => {
    if (level !== 3) {
      unregister([
        'serviceType',
        'pricingMode',
        'rateDeviationPercent',
        'estimatedDuration',
        'bufferTime',
        'travelRatePerKM',
        'allowBulkOffers',
        'allowSuddenBooking',
      ]);
    }
  }, [level, unregister]);

  useEffect(() => {
    const baseValues = {
      name: category?.name ?? '',
      description: category?.description ?? '',
      iconUrl: category?.iconUrl ?? '',
      imageUrl: category?.imageUrl ?? '',
      parentId: category?.parentId ?? parentCategory?.id ?? null,
      platformFee: category?.platformFee ?? parentCategory?.platformFee ?? 1,
      baseRate: category?.baseRate ?? parentCategory?.baseRate ?? 0,
      isAvailable: category?.isAvailable ?? true,
    };

    if (level === 3) {
      reset({
        ...baseValues,
        level: 3,
        serviceType: category?.serviceType ?? SERVICE_TYPE.SMALL_TASK,
        pricingMode: category?.pricingMode ?? PRICING_MODE.FIXED,
        rateDeviationPercent: category?.rateDeviationPercent ?? 50,
        estimatedDuration: category?.estimatedDuration ?? 60,
        bufferTime: category?.bufferTime ?? 30,
        travelRatePerKM: category?.travelRatePerKM ?? parentCategory?.travelRatePerKM ?? 8,
        allowBulkOffers: category?.allowBulkOffers ?? false,
        allowSuddenBooking: category?.allowSuddenBooking ?? false,
      });
    } else {
      reset({
        ...baseValues,
        level: level as 1 | 2,
      });
    }
  }, [category, level, parentCategory, reset]);

  return {
    form,
    level,
    isLevel3: level === 3,
    serviceType,
    estimatedDuration,
    bufferTime,
  };
}
