import { PricingMode, ServiceType } from "@/constants";
import { BulkDiscountType } from "@/types/service/service.entity";
import { PublicWorkerServiceItem, WorkerServiceItem } from "@/types/service/service.projection";

export class ServiceResponseDto {
  id!: string;
  categoryId!: string;
  serviceName!: string;
  serviceType!: ServiceType;
  pricingMode!: PricingMode;
  iconUrl!: string;
  imageUrl!: string;

  rate!: number;
  description?: string;
  experience!: number;
  estimatedDuration!: number;
  bufferTime?: number;
  maxTravelRadius!: number;
  bulkDiscounts?: BulkDiscountType[];
  allowSuddenBooking?: boolean;
  isAvailable!: boolean;
  maxTravelCost?: number | null;
  createdAt!: Date;

  static fromEntity(entity: WorkerServiceItem): ServiceResponseDto {
    const dto = new ServiceResponseDto();
    const { _id, name, iconUrl, imageUrl, pricingMode, serviceType } = entity.categoryId;

    dto.id = entity._id.toString();
    dto.categoryId = _id.toString();
    dto.serviceName = name;
    dto.serviceType = serviceType as ServiceType;
    dto.pricingMode = pricingMode as PricingMode;
    dto.iconUrl = iconUrl;
    dto.imageUrl = imageUrl;

    dto.rate = entity.rate;
    dto.experience = entity.experience;
    dto.description = entity.description;
    dto.estimatedDuration = entity.estimatedDuration;
    dto.bufferTime = entity.bufferTime;
    dto.maxTravelRadius = entity.maxTravelRadius;
    dto.bulkDiscounts = entity.bulkDiscounts;
    dto.allowSuddenBooking = entity.allowSuddenBooking;
    dto.isAvailable = entity.isAvailable;
    dto.maxTravelCost = entity.maxTravelCost;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  static fromEntities(entities: WorkerServiceItem[]): ServiceResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PublicServiceListResponseDto {
  id!: string;
  categoryId!: string;
  serviceName!: string;
  categoryName!: string;
  serviceType!: ServiceType;
  pricingMode!: PricingMode;
  iconUrl!: string;
  imageUrl!: string;

  rate!: number;
  description?: string;
  experience!: number;
  estimatedDuration!: number;
  bulkDiscounts?: BulkDiscountType[];

  static fromEntity(entity: PublicWorkerServiceItem): PublicServiceListResponseDto {
    const dto = new PublicServiceListResponseDto();

    dto.id = entity._id.toString();
    dto.categoryId = entity.categoryId?.toString();
    dto.serviceName = entity.serviceName;
    dto.categoryName = entity.categoryName;
    dto.serviceType = entity.serviceType;
    dto.pricingMode = entity.pricingMode;
    dto.iconUrl = entity.iconUrl;
    dto.imageUrl = entity.imageUrl;
    dto.experience = entity.experience;

    dto.rate = entity.rate;
    dto.description = entity.description;
    dto.estimatedDuration = entity.estimatedDuration;
    dto.bulkDiscounts = entity.bulkDiscounts;

    return dto;
  }

  static fromEntities(entities: PublicWorkerServiceItem[]): PublicServiceListResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
