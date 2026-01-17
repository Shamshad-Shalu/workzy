import { IsMongoId } from "class-validator";
import { ICategory } from "@/types/category";
import { PricingMode, ServiceType } from "@/constants";

export class CategoryResponseDTO {
  @IsMongoId()
  _id!: string;
  name!: string;
  description!: string;
  iconUrl!: string;
  imageUrl!: string;
  parentId?: string | null;
  platformFee!: number;
  level!: number;
  isAvailable!: boolean;
  baseRate!: number;
  rateDeviationPercent?: number;
  estimatedDuration?: number;
  bufferTime?: number;
  travelRatePerKM?: number;
  serviceType?: ServiceType;
  pricingMode?: PricingMode;
  allowBulkOffers?: boolean;
  allowSuddenBooking?: boolean;
  createdAt!: Date;

  static fromEntity(entity: ICategory): CategoryResponseDTO {
    const dto = new CategoryResponseDTO();

    dto._id = entity._id.toString();
    dto.name = entity.name;
    dto.description = entity.description || "";
    dto.level = entity.level;
    dto.iconUrl = entity.iconUrl || "";
    dto.imageUrl = entity.imageUrl || "";
    dto.parentId = entity.parentId ? entity.parentId.toString() : null;
    dto.platformFee = entity.platformFee;
    dto.isAvailable = entity.isAvailable;
    dto.createdAt = entity.createdAt;
    dto.baseRate = entity.baseRate;
    dto.rateDeviationPercent = entity.rateDeviationPercent;
    dto.estimatedDuration = entity.estimatedDuration;
    dto.bufferTime = entity.bufferTime;
    dto.travelRatePerKM = entity.travelRatePerKM;
    dto.serviceType = entity.serviceType;
    dto.pricingMode = entity.pricingMode;
    dto.allowBulkOffers = entity.allowBulkOffers;
    dto.allowSuddenBooking = entity.allowSuddenBooking;

    return dto;
  }

  static fromEntities(entities: ICategory[]): CategoryResponseDTO[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
