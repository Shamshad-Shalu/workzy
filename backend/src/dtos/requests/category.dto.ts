import { CATEGORY, DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

export class CategoryRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Category name is requiered." })
  @Matches(SERVICE_NAME_REGEX, { message: CATEGORY.INVALID })
  name!: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @IsOptional()
  parentId?: string | null;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Platform fee must be non-negative." })
  @Max(50, { message: "Platform fee cannot exceed 50%." })
  platformFee!: number;

  @IsString()
  imageUrl!: string;

  @IsString()
  iconUrl!: string;
}

export class CategoryUpdateRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: CATEGORY.INVALID })
  name!: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @IsOptional()
  parentId?: string | null;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Platform fee must be non-negative." })
  @Max(50, { message: "Platform fee cannot exceed 50%." })
  platformFee?: number;

  @IsString()
  imageUrl!: string;

  @IsString()
  iconUrl!: string;
}
