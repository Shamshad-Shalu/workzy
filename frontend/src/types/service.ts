import type { PricingMode, ServiceType } from '@/constants';

export interface BulkDiscountType {
  count: number;
  percent: number;
}

export interface Service {
  id: string;
  serviceName: string; // category name
  serviceType: ServiceType; //category type
  pricingMode: PricingMode; // category pricing mode ,
  imageUrl: string;
  workerId: string;
  categoryId: string;
  rate: number;
  description: string;
  estimatedDuration: number;
  bufferTime: number;
  maxTravelRadius: number;
  bulkDiscounts?: BulkDiscountType[];
  allowSuddenBooking?: boolean;
  isAvailable: boolean;
  experience: number;
  maxTravelCost?: number | null;
  createdAt: Date;
}
export interface ServiceResponse {
  services: Service[];
  total: number;
}

export type ServiceFilters = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  categoryId: string | null;
};
