import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { SERVICE_TYPE } from '@/constants';
import type { Category } from '@/types/category';
import type { Service } from '@/types/service';

import { serviceSchema } from '../validation/ServiceFormData';

const baseDefaults = {
  categoryId: '',
  rate: 0,
  description: '',
  estimatedDuration: 0,
  bufferTime: 0,
  experience: 0,
  maxTravelRadius: 5,
  maxTravelCost: null as number | null,
  allowSuddenBooking: false,
  isAvailable: true,
  bulkDiscounts: [] as { count: number; percent: number }[],
  _baseRate: undefined as number | undefined,
  _deviation: undefined as number | undefined,
  _baseDuration: undefined as number | undefined,
  _baseBuffer: undefined as number | undefined,
  _serviceType: undefined as string | undefined,
  _setTravelCost: false,
};

const snapToQuarterHour = (mins?: number | null) => {
  const safe = Number.isFinite(mins as number) ? Number(mins) : 0;
  const bounded = Math.max(0, safe);
  return Math.round(bounded / 15) * 15;
};

function resolveDurationMinutes(category: Category): number {
  const raw = category.estimatedDuration;
  if (raw === null || raw === undefined || raw <= 0) {
    return 0;
  }
  return snapToQuarterHour(raw);
}

function resolveBufferMinutes(category: Category): number {
  let b = snapToQuarterHour(category.bufferTime ?? 0);
  if (category.serviceType === SERVICE_TYPE.INSPECTION && b < 15) {
    b = 15;
  }
  return b;
}

export function useServiceForm(service?: Service | null, category?: Category | null) {
  const form = useForm({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: baseDefaults,
  });

  const { reset } = form;

  useEffect(() => {
    if (service) {
      const fromService =
        typeof service.estimatedDuration === 'number' && service.estimatedDuration > 0
          ? snapToQuarterHour(service.estimatedDuration)
          : null;
      const estimatedDuration = fromService ?? (category ? resolveDurationMinutes(category) : 0);
      let buf = snapToQuarterHour(service.bufferTime ?? category?.bufferTime ?? 0);
      if (category?.serviceType === SERVICE_TYPE.INSPECTION && buf < 15) {
        buf = 15;
      }
      reset({
        ...baseDefaults,
        categoryId: service.categoryId,
        rate: service.rate,
        description: service.description ?? '',
        estimatedDuration,
        bufferTime: buf,
        experience: service.experience ?? 0,
        maxTravelRadius: service.maxTravelRadius ?? 5,
        maxTravelCost: service.maxTravelCost ?? null,
        allowSuddenBooking: service.allowSuddenBooking ?? false,
        isAvailable: service.isAvailable ?? true,
        bulkDiscounts: service.bulkDiscounts ?? [],
        _baseRate: category?.baseRate,
        _deviation: category ? (category.baseRate * (category.priceVarianceLimit || 0)) / 100 : 0,
        _setTravelCost: !!service.maxTravelCost,
        _baseBuffer: category?.bufferTime ?? 0,
        _baseDuration:
          typeof category?.estimatedDuration === 'number' && category.estimatedDuration > 0
            ? category.estimatedDuration
            : undefined,
        _serviceType: category?.serviceType,
      });
      return;
    }

    if (category) {
      const baselineDuration =
        typeof category.estimatedDuration === 'number' && category.estimatedDuration > 0
          ? category.estimatedDuration
          : undefined;
      reset({
        ...baseDefaults,
        categoryId: category.id,
        rate: category.baseRate,
        description: category.description ?? '',
        estimatedDuration: resolveDurationMinutes(category),
        bufferTime: resolveBufferMinutes(category),
        _baseRate: category.baseRate,
        _deviation: (category.baseRate * (category.priceVarianceLimit || 0)) / 100,
        _baseBuffer: category.bufferTime ?? 0,
        _baseDuration: baselineDuration,
        _serviceType: category.serviceType,
      });
    }
  }, [service, category, reset]);

  return form;
}
