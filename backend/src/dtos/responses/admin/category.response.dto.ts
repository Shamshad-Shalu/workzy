import { IsBoolean, IsMongoId, IsOptional, IsNumber, IsString } from "class-validator";
import { ICategory } from "@/types/category";

export class CategoryResponseDTO {
  @IsMongoId()
  _id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  iconUrl!: string;

  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string | null;

  @IsNumber()
  platformFee!: number;

  @IsNumber()
  level!: number;

  @IsBoolean()
  isAvailable!: boolean;

  @IsString()
  createdAt!: Date;

  static fromEntity(entity: ICategory): CategoryResponseDTO {
    const dto = new CategoryResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.description = entity.description || "";
    dto.level = entity.level;
    dto.iconUrl = entity.iconUrl || "";
    dto.imageUrl = entity.imageUrl || "";
    dto.parentId = entity.parentId ? entity.parentId.toString() : null;
    dto.platformFee = entity.platformFee;
    dto.isAvailable = entity.isAvailable;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  static fromEntities(entities: ICategory[]): CategoryResponseDTO[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
