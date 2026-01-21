import { Types } from "mongoose";
import { BulkDiscountType } from "./service";
import { PricingMode, ServiceType } from "@/constants";

export interface AggregatedService {
  serviceName: string; // the category name
  serviceType: ServiceType; //category type
  pricingMode: PricingMode; // category pricing mode ,

  _id: Types.ObjectId;
  workerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  rate: number;
  description: string;
  experience: number;
  estimatedDuration: number;
  bufferTime?: number;
  isAvailable: boolean;
  maxTravelRadius: number;
  allowSuddenBooking?: boolean;
  maxTravelCost?: number | null;
  bulkDiscounts?: BulkDiscountType[];
  createdAt: Date;
}

export interface WorkerServicesAggregationResult {
  services: AggregatedService[];
  total: number;
}
