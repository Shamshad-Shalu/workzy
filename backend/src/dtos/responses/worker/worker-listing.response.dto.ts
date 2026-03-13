import {
  DEFAULT_IMAGE_URL,
  DEFAULT_WORKER_COVER_IMAGE,
  PricingMode,
  ServiceType,
} from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { BulkDiscountType } from "@/types/service";
import { WorkerListingEntity } from "@/types/worker";

export class WorkerListingResponseDto {
  serviceId!: string;
  workerId!: string;
  userId!: string;
  displayName!: string;
  tagline!: string;
  description!: string;
  coverImage!: string | null;
  profileImage!: string;
  experience!: number;
  serviceRate!: number;
  estimatedDuration!: number | null;
  averageRating!: number;
  worksCompleted!: number;
  reviewCount!: number;
  categoryName!: string;
  PricingMode!: PricingMode;
  serviceType!: ServiceType;
  isPremium!: boolean;
  bulkDiscounts!: BulkDiscountType[] | null;
  travelCost!: number | null;
  distanceKm?: number | null;
  totalAmount!: number;

  static async fromEntity(
    entity: WorkerListingEntity,
    s3Service: IS3Service
  ): Promise<WorkerListingResponseDto> {
    const dto = new WorkerListingResponseDto();

    const profileImage = entity.profileImage?.includes("private")
      ? await s3Service.generateSignedUrl(entity.profileImage)
      : entity.profileImage || DEFAULT_IMAGE_URL;

    const coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    const travelCost = entity.travelCost ? Math.floor(entity.travelCost) : null;

    dto.serviceId = entity.serviceId.toString();
    dto.workerId = entity.workerId.toString();
    dto.userId = entity.userId.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.description = entity.description;
    dto.coverImage = coverImage;
    dto.profileImage = profileImage;
    dto.experience = entity.experience;
    dto.serviceRate = entity.serviceRate;
    dto.worksCompleted = entity.worksCompleted;
    dto.estimatedDuration = entity.estimatedDuration ?? null;
    dto.averageRating = entity.averageRating;
    dto.bulkDiscounts = entity.bulkDiscounts;
    dto.reviewCount = entity.reviewCount;
    dto.categoryName = entity.categoryName;
    dto.isPremium = entity.isPremium;
    dto.PricingMode = entity.pricingMode;
    dto.serviceType = entity.serviceType;
    dto.travelCost = travelCost;
    dto.distanceKm = entity.distanceKm ?? null;
    dto.totalAmount = travelCost ? travelCost + entity.serviceRate : entity.serviceRate;
    return dto;
  }

  static async fromEntities(
    entities: WorkerListingEntity[],
    s3Service: IS3Service
  ): Promise<WorkerListingResponseDto[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
