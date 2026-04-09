import type { PricingMode, ServiceType } from '@/constants';

export interface Category {
  id: string;
  name: string;
  description?: string;
  level: number;
  iconUrl: string;
  imageUrl: string;
  isAvailable: boolean;
  platformFee: number;
  parentId?: null | string;

  baseRate: number;
  priceVarianceLimit?: number;
  estimatedDuration: number;
  bufferTime: number;
  travelRatePerKM?: number;
  serviceType?: ServiceType;
  pricingMode?: PricingMode;
  allowBulkOffers?: boolean;
  allowSuddenBooking?: boolean;
}

export type CategoryOption = Pick<Category, 'id' | 'name'>;
export type CategoryLite = Pick<Category, 'id' | 'name' | 'level' | 'iconUrl'>;
export type CategorySuggestion = Pick<Category, 'id' | 'name' | 'level' | 'iconUrl' | 'parentId'>;
