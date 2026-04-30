import { PricingMode, ServiceType } from "@/constants";
import { BulkDiscountType } from "@/types/service";
import { PublicWorkerListItem } from "@/types/worker/worker.projection";

export class PublicWorkerListResponseDto {
  id!: string;
  categoryName!: string;
  serviceType!: ServiceType;
  PricingMode!: PricingMode;

  serviceId!: string;
  displayName!: string;
  tagline!: string;
  description!: string;
  profileImage?: string;
  experience!: number;
  serviceRate!: number;
  estimatedDuration!: number;
  reviewCount!: number;
  bufferTime!: number;
  isAvailable!: boolean;
  averageRating!: number;
  bulkDiscounts!: BulkDiscountType[] | null;
  totalAmount!: number;
  travelCost!: number;
  distanceKm!: number;

  static fromEntity(entity: PublicWorkerListItem): PublicWorkerListResponseDto {
    const dto = new PublicWorkerListResponseDto();

    dto.id = entity._id.toString();
    dto.serviceId = entity.serviceId.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.description = entity.description;
    dto.profileImage = entity.profileImage;
    dto.experience = entity.experience;
    dto.serviceRate = entity.serviceRate;
    dto.PricingMode = entity.PricingMode;
    dto.estimatedDuration = entity.estimatedDuration;
    dto.bufferTime = entity.bufferTime;
    dto.averageRating = entity.averageRating;
    dto.bulkDiscounts = entity.bulkDiscounts;
    dto.reviewCount = entity.reviewCount;
    dto.categoryName = entity.categoryName;

    dto.serviceType = entity.serviceType;
    dto.travelCost = Math.round(entity.travelCost);
    dto.distanceKm = Math.round(entity.distanceKm * 10) / 10;
    dto.totalAmount = Math.floor(entity.travelCost + entity.serviceRate);
    return dto;
  }

  static fromEntities(entities: PublicWorkerListItem[]): PublicWorkerListResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
