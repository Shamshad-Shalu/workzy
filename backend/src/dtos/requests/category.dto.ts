import { CATEGORY, DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { PRICING_MODE, PricingMode, SERVICE_TYPE, ServiceType } from "@/constants";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from "class-validator";

export class CategoryRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: CATEGORY.NAME_REQUIRED })
  name!: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @IsOptional()
  parentId?: string | null;

  @IsInt()
  @IsEnum([1, 2, 3], { message: CATEGORY.INVALID_LEVEL })
  level!: 1 | 2 | 3;

  @IsString()
  imageUrl!: string;

  @IsString()
  iconUrl!: string;

  @IsNumber()
  @Min(0, { message: "Platform fee must be non-negative." })
  @Max(50, { message: "Platform fee cannot exceed 50%." })
  platformFee!: number;

  @IsBoolean()
  isAvailable: boolean = true;

  @IsNumber()
  @Min(0, { message: "Base rate is required" })
  baseRate!: number;

  @ValidateIf((o) => o.level === 3)
  @IsEnum(SERVICE_TYPE, { message: "Invalid service type." })
  serviceType?: ServiceType;

  @ValidateIf((o) => o.level === 3)
  @IsEnum(PRICING_MODE, { message: "Invalid pricing mode." })
  pricingMode?: PricingMode;

  @ValidateIf((o) => o.level === 3)
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Rate deviation percent must be non-negative." })
  @Max(100, { message: "Rate deviation percent cannot exceed 100%." })
  rateDeviationPercent?: number;

  @ValidateIf((o) => o.level === 3)
  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: "Estimated duration is required." })
  estimatedDuration?: number;

  @ValidateIf((o) => o.level === 3)
  @Type(() => Number)
  @IsInt()
  @Min(0, { message: "Buffer time is required." })
  bufferTime?: number;

  @ValidateIf((o) => o.level === 3)
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Travel rate per KM is required." })
  travelRatePerKM?: number;

  @ValidateIf((o) => o.level === 3)
  @IsBoolean()
  allowBulkOffers?: boolean;

  @ValidateIf((o) => o.level === 3)
  @IsBoolean()
  allowSuddenBooking?: boolean;

  @ValidateIf(
    (o) => o.level === 3 && o.serviceType === SERVICE_TYPE.REMOTE && o.travelRatePerKM !== 0,
    { message: "Travel rate per KM must be 0 for Remote services" }
  )
  @IsNumber()
  private _remoteTravelMustBeZero!: never;

  @ValidateIf((o) => o.parentId === null && (o.level === 2 || o.level === 3), {
    message: "Invalid level",
  })
  @IsString()
  private _invalidLevelForSubCategory!: never;

  @ValidateIf(
    (o) =>
      o.level === 3 &&
      (o.serviceType === SERVICE_TYPE.MAJOR_PROJECT ||
        o.serviceType === SERVICE_TYPE.CONSULTATION) &&
      o.allowBulkOffers === true,
    { message: "Bulk offers not allowed for this service type." }
  )
  @IsBoolean()
  private _bulkOffersNotAllowed!: never;

  @ValidateIf(
    (o) =>
      o.level === 3 && o.serviceType !== SERVICE_TYPE.SMALL_TASK && o.allowSuddenBooking === true,
    { message: "Sudden booking not allowed for this service type." }
  )
  @IsBoolean()
  private _suddenBookingNotAllowed!: never;

  @ValidateIf(
    (o) =>
      o.level === 3 &&
      o.serviceType === SERVICE_TYPE.CONSULTATION &&
      o.pricingMode !== PRICING_MODE.FIXED,
    { message: "Consultation must have Fixed pricing" }
  )
  @IsEnum(PRICING_MODE)
  private _consultationPricingModeCheck!: never;
}

export class CategoryUpdateRequestDTO extends CategoryRequestDTO {}
