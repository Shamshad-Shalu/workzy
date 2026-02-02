import { SERVICE_TYPE } from '@/constants';
import type { Category } from '@/types/category';

export interface FilterConfig {
  showRadius: boolean;
  showPriceRange: boolean;
  showRating: boolean;
  showAvailableNow: boolean;
  minPrice: number;
  maxPrice: number;
  step: number;
}

export function getFilterConfig(service?: Category | null): FilterConfig {
  if (!service) {
    return {
      showRadius: true,
      showPriceRange: true,
      showRating: true,
      showAvailableNow: true,
      minPrice: 0,
      maxPrice: 10000,
      step: 50,
    };
  }

  const deviation = service.rateDeviationPercent ?? 50;
  const rawMax = service.baseRate + (service.baseRate * deviation) / 100;
  const rawMin = service.baseRate - (service.baseRate * deviation) / 100;

  const minPrice = Math.max(0, Math.round(rawMin));
  const maxPrice = Math.max(minPrice + 1, Math.round(rawMax));
  const step = Math.max(1, Math.round((maxPrice - minPrice) * 0.1));
  return {
    showRadius: service.serviceType !== SERVICE_TYPE.REMOTE,
    showPriceRange: true,
    showRating: true,
    showAvailableNow: service.allowSuddenBooking ?? false,
    minPrice,
    maxPrice,
    step,
  };
}
