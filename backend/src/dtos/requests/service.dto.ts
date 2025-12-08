import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
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
  @IsMongoId({ message: "Invalid parent ID format." })
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @Min(0, { message: "Platform fee must be non-negative." })
  @Max(50, { message: "Platform fee cannot exceed 50%." })
  platformFee!: number;
}
