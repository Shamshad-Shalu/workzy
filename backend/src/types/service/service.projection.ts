import { Types } from "mongoose";

import { PricingMode, ServiceType } from "@/constants";

import { BulkDiscountType, IService } from "./service.entity";

export type WorkerServiceItem = Omit<IService, "categoryId"> & {
  categoryId: {
    _id: Types.ObjectId;
    parentId: Types.ObjectId;
    name: string;
    iconUrl: string;
    imageUrl: string;
    serviceType?: ServiceType;
    pricingMode?: PricingMode;
  };
};

export type PublicWorkerServiceItem = {
  _id: Types.ObjectId;
  categoryId: Types.ObjectId;
  serviceName: string;
  categoryName: string;
  rate: number;
  experience: number;
  description: string;
  iconUrl: string;
  imageUrl: string;
  serviceType: ServiceType;
  pricingMode: PricingMode;
  estimatedDuration: number;
  bulkDiscounts?: BulkDiscountType[];
  createdAt: Date;
};
