import { IsBoolean, IsMongoId, IsOptional, IsNumber, IsString } from "class-validator";
import { IService } from "@/types/service";

export class ServiceResponseDTO {
  @IsMongoId()
  _id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string | null;

  @IsNumber()
  platformFee!: number;

  @IsBoolean()
  isAvailable!: boolean;

  @IsString()
  createdAt!: Date;

  static fromEntity(entity: IService): ServiceResponseDTO {
    const dto = new ServiceResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.iconUrl = entity.iconUrl;
    dto.imageUrl = entity.imageUrl;
    dto.parentId = entity.parentId ? entity.parentId.toString() : null;
    dto.platformFee = entity.platformFee;
    dto.isAvailable = entity.isAvailable;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
