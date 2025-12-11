import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

export class ServiceRequestDTO {
  @IsString()
  @IsNotEmpty({ message: "Service name is requiered." })
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid service name format." })
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
  level!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Platform fee must be non-negative." })
  @Max(50, { message: "Platform fee cannot exceed 50%." })
  platformFee!: number;
}

export class ServiceUpdateRequestDTO {
  @IsMongoId({ message: "Invalid service ID format." })
  @IsOptional()
  _id?: string;

  @IsOptional()
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid service name format." })
  name?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @Type(() => Number)
  @IsNumber()
  level!: number;

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
}
