import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
  _setTravelCost: false,
};

export function useServiceForm(service?: Service | null, category?: Category | null) {
  const form = useForm({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: baseDefaults,
  });

  const { reset } = form;

  useEffect(() => {
    if (category && !service) {
      reset({
        ...baseDefaults,
        categoryId: category.id,
        rate: category.baseRate,
        description: category.description ?? '',
        estimatedDuration: category.estimatedDuration ?? 0,
        bufferTime: category.bufferTime ?? 0,
        _baseRate: category.baseRate,
        _deviation: (category.baseRate * (category.priceVarianceLimit || 0)) / 100,
        _baseBuffer: category.bufferTime,
        _baseDuration: category.estimatedDuration,
      });
    }

    if (service) {
      reset({
        ...baseDefaults,
        categoryId: service.categoryId,
        rate: service.rate,
        description: service.description ?? '',
        estimatedDuration: service.estimatedDuration ?? 0,
        bufferTime: service.bufferTime ?? 0,
        experience: service.experience ?? 0,
        maxTravelRadius: service.maxTravelRadius ?? 5,
        maxTravelCost: service.maxTravelCost ?? null,
        allowSuddenBooking: service.allowSuddenBooking ?? false,
        isAvailable: service.isAvailable ?? true,
        bulkDiscounts: service.bulkDiscounts ?? [],
        _baseRate: category?.baseRate,
        _deviation: category ? (category.baseRate * (category.priceVarianceLimit || 0)) / 100 : 0,
        _setTravelCost: !!service.maxTravelCost,
        _baseBuffer: category?.bufferTime,
        _baseDuration: category?.estimatedDuration,
      });
    }
  }, [service, category, reset]);

  return form;
}
