import type { PricingMode, ServiceType } from '@/constants';

export interface BulkDiscountType {
  count: number;
  percent: number;
}

export interface Service {
  id: string;
  categoryId: string;
  serviceName: string;
  serviceType: ServiceType;
  pricingMode: PricingMode;
  iconUrl: string;
  imageUrl: string;

  rate: number;
  description?: string;
  experience: number;
  estimatedDuration: number;
  bufferTime?: number;
  maxTravelRadius: number;
  bulkDiscounts?: BulkDiscountType[];
  allowSuddenBooking?: boolean;
  isAvailable: boolean;
  maxTravelCost?: number | null;
  createdAt: Date;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export type WorkerServicesResponse = {
  services: Service[];
  nextCursor: string | null;
};

export type ServiceFilters = {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string | null;
};
