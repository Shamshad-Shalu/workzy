import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { PRICING_MODE, SERVICE_TYPE } from '@/constants';
import type { Category } from '@/types/category';

import { categorySchema, type CategoryFormData } from '../validation/categorySchema';

type UseCategoryFormProps = {
  category?: Category | null;
  parentCategory?: Category | null;
};

export function useCategoryForm({ category, parentCategory }: UseCategoryFormProps) {
  const level = useMemo(
    () => (category?.level ?? (parentCategory ? parentCategory.level + 1 : 1)) as 1 | 2,
    [category, parentCategory]
  );

  const defaultValues = useMemo(() => {
    const base = {
      name: category?.name ?? '',
      description: category?.description ?? '',
      iconUrl: category?.iconUrl ?? '',
      imageUrl: category?.imageUrl ?? '',
      platformFee: category?.platformFee ?? parentCategory?.platformFee ?? 1,
      baseRate: category?.baseRate ?? parentCategory?.baseRate ?? 0,
      isAvailable: category?.isAvailable ?? true,
    };

    if (level === 2) {
      return {
        ...base,
        level: 2 as const,
        parentId: category?.parentId ?? parentCategory?.id ?? '',
        serviceType: category?.serviceType ?? SERVICE_TYPE.SMALL_TASK,
        pricingMode: category?.pricingMode ?? PRICING_MODE.FIXED,
        priceVarianceLimit: category?.priceVarianceLimit ?? 50,
        estimatedDuration: category?.estimatedDuration ?? 60,
        bufferTime: category?.bufferTime ?? 30,
        travelRatePerKM: category?.travelRatePerKM ?? parentCategory?.travelRatePerKM ?? 8,
        allowBulkOffers: category?.allowBulkOffers ?? false,
        allowSuddenBooking: category?.allowSuddenBooking ?? false,
      };
    }

    return {
      ...base,
      level: 1 as const,
      parentId: null,
    };
  }, [category, level, parentCategory]);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues,
  });

  const { reset, watch, unregister } = form;

  const serviceType = watch('serviceType');
  const pricingMode = watch('pricingMode');
  const estimatedDuration = watch('estimatedDuration') ?? 0;
  const bufferTime = watch('bufferTime') ?? 0;

  useEffect(() => {
    if (level === 2 && serviceType) {
      if (serviceType !== SERVICE_TYPE.SMALL_TASK) {
        form.setValue('allowBulkOffers', false);
      }
      if (serviceType === SERVICE_TYPE.MAJOR_PROJECT) {
        form.setValue('allowSuddenBooking', false);
      }

      if (serviceType === SERVICE_TYPE.CONSULTATION || serviceType === SERVICE_TYPE.INSPECTION) {
        form.setValue('pricingMode', PRICING_MODE.FIXED);
      }

      if (pricingMode === PRICING_MODE.FIXED) {
        form.setValue('allowBulkOffers', false);
      }
    }
  }, [serviceType, pricingMode, level, form]);

  useEffect(() => {
    if (level !== 2) {
      unregister([
        'serviceType',
        'pricingMode',
        'priceVarianceLimit',
        'estimatedDuration',
        'bufferTime',
        'travelRatePerKM',
        'allowBulkOffers',
        'allowSuddenBooking',
      ]);
    }
  }, [level, unregister]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return {
    form,
    level,
    isLevel2: level === 2,
    serviceType,
    estimatedDuration,
    bufferTime,
  };
}
