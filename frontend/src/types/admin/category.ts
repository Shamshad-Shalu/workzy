import type { PricingMode, ServiceType } from '@/constants';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  level: number;
  iconUrl: string;
  imageUrl: string;
  isAvailable: boolean;
  platformFee: number;
  parentId?: null | string;

  baseRate: number;
  rateDeviationPercent?: number;
  estimatedDuration: number;
  bufferTime: number;
  travelRatePerKM?: number;
  serviceType?: ServiceType;
  pricingMode?: PricingMode;
  allowBulkOffers?: boolean;
  allowSuddenBooking?: boolean;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}

export type CategoryFilters = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  parentId: string | null;
};
