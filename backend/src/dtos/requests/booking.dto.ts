import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

import { LocationDTO } from "./profile.dto";

class BookingLocationDTO {
  @IsString()
  label!: string;

  @ValidateNested()
  @Type(() => LocationDTO)
  location!: LocationDTO;
}
export class CreatebookingDTO {
  @IsMongoId()
  workerId!: string;

  @IsMongoId()
  serviceId!: string;

  @IsMongoId()
  slotId!: string;

  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  date!: Date;

  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @Matches(/^\d{2}:\d{2}$/)
  endTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  itemCount?: number;

  @IsInt()
  @Min(10)
  duration!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookingLocationDTO)
  address!: BookingLocationDTO | null;

  @IsOptional()
  @IsString()
  userNote?: string;
}

export class CancelBookingDTO {
  @IsString()
  @MinLength(10, { message: "Please provide a reason (min 10 chars)" })
  @MaxLength(500)
  reason!: string;
}

export class RejectBookingDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason!: string;
}

export class EvidenceItemDTO {
  @IsString()
  url!: string;

  @IsIn(["image", "video"])
  type!: "image" | "video";
}

export class EvidenceDTO {
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => EvidenceItemDTO)
  before!: EvidenceItemDTO[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => EvidenceItemDTO)
  after!: EvidenceItemDTO[];
}

export class CompleteBookingDTO {
  @ValidateNested()
  @Type(() => EvidenceDTO)
  evidence!: EvidenceDTO;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class ExtraChargeDTO {
  @IsNumber()
  @Min(60, { message: "Minimum extra charge amount is ₹60" })
  amount!: number;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason!: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}
