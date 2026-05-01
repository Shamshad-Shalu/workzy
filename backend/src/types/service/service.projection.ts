import { Types } from "mongoose";

import { PricingMode, ServiceType } from "@/constants";

import { IService } from "./service.entity";

export type WorkerServiceItem = Omit<IService, "categoryId"> & {
  categoryId: {
    _id: Types.ObjectId;
    name: string;
    iconUrl: string;
    imageUrl: string;
    serviceType?: ServiceType;
    pricingMode?: PricingMode;
  };
};
