import { PricingMode, ServiceType } from "@/constants";
import { ICategory } from "@/types/category";
import { BulkDiscountType, IService } from "@/types/service";

export class ServiceResponseDTO {
  id!: string;
  rate!: number;
  description?: string;
  estimatedDuration?: number;
  bufferTime?: number;
  maxTravelRadius!: number;
  bulkDiscounts?: BulkDiscountType[];
  allowSuddenBooking?: boolean;
  isAvailable!: boolean;
  experience!: number;
  maxTravelCost?: number | null;
  createdAt!: Date;

  serviceType!: ServiceType;
  pricingMode!: PricingMode;
  serviceName!: string;

  static fromEntity(entity: IService, category: ICategory): ServiceResponseDTO {
    const dto = new ServiceResponseDTO();

    dto.id = entity.id;
    dto.serviceName = category.name;
    dto.serviceType = category.serviceType as ServiceType;
    dto.pricingMode = category.pricingMode as PricingMode;
    dto.rate = entity.rate;
    dto.description = entity.description;
    dto.estimatedDuration = entity.estimatedDuration;
    dto.bufferTime = entity.bufferTime;
    dto.maxTravelRadius = entity.maxTravelRadius;
    dto.bulkDiscounts = entity.bulkDiscounts;
    dto.allowSuddenBooking = entity.allowSuddenBooking;
    dto.isAvailable = entity.isAvailable;
    dto.experience = entity.experience;
    dto.maxTravelCost = entity.maxTravelCost;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
