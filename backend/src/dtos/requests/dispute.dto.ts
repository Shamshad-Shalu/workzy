import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

import {
  DESCRIPTION_REGEX,
  DISPUTE_REASON_VALUES,
  DISPUTE_RESOLUTION,
  DISPUTE_STATUS_VALUES,
  DisputeReason,
  DisputeStatus,
} from "@/constants";

import { EvidenceItemDTO } from "./booking.dto";

export class CreateDisputeDto {
  @IsEnum(DISPUTE_REASON_VALUES)
  reason!: DisputeReason;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => EvidenceItemDTO)
  evidence!: EvidenceItemDTO[];
}

export class ResolveDisputeDto {
  @IsEnum(DISPUTE_STATUS_VALUES)
  status!: DisputeStatus;

  @IsOptional()
  @IsEnum(DISPUTE_RESOLUTION)
  resolution?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  note!: string;

  @IsOptional()
  @IsNumber()
  @Min(100, { message: "Refunded amount must be Greater than 100." })
  refundedAmount?: number;
}
