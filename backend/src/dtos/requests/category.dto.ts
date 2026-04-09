import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  Validate,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

import { CATEGORY, DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { PRICING_MODE, PricingMode, SERVICE_TYPE, ServiceType } from "@/constants";

@ValidatorConstraint({ name: "CategoryRules", async: false })
export class CategoryRules implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const o = args.object as CategoryRequestDTO;

    if (
      o.level === 2 &&
      (o.serviceType === SERVICE_TYPE.MAJOR_PROJECT ||
        o.serviceType === SERVICE_TYPE.CONSULTATION ||
        o.serviceType === SERVICE_TYPE.INSPECTION ||
        o.pricingMode === PRICING_MODE.FIXED) &&
      o.allowBulkOffers === true
    ) {
      return false;
    }

    if (
      o.level === 2 &&
      o.serviceType === SERVICE_TYPE.MAJOR_PROJECT &&
      o.allowSuddenBooking === true
    ) {
      return false;
    }

    if (
      o.level === 2 &&
      (o.serviceType === SERVICE_TYPE.CONSULTATION || o.serviceType === SERVICE_TYPE.INSPECTION) &&
      o.pricingMode !== PRICING_MODE.FIXED
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const o = args.object as CategoryRequestDTO;

    if (
      o.level === 2 &&
      (o.serviceType === SERVICE_TYPE.CONSULTATION || o.serviceType === SERVICE_TYPE.INSPECTION) &&
      o.pricingMode !== PRICING_MODE.FIXED
    ) {
      return `${o.serviceType} must have Fixed pricing`;
    }

    if (o.level === 2 && o.serviceType === SERVICE_TYPE.MAJOR_PROJECT && o.allowSuddenBooking) {
      return "Sudden booking not allowed for this service type.";
    }

    if (
      o.level === 2 &&
      (o.serviceType === SERVICE_TYPE.MAJOR_PROJECT ||
        o.serviceType === SERVICE_TYPE.CONSULTATION ||
        o.serviceType === SERVICE_TYPE.INSPECTION ||
        o.pricingMode === PRICING_MODE.FIXED) &&
      o.allowBulkOffers
    ) {
      return "Bulk offers not allowed for this pricing configuration.";
    }

    return "Invalid category configuration";
  }
}

export class CategoryRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: CATEGORY.NAME_REQUIRED })
  name!: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @ValidateIf((o) => o.level === 2)
  @IsMongoId({ message: "Subcategories must have a valid parent category." })
  @IsDefined({ message: "Parent category is required." })
  parentId?: string | null;

  @IsInt()
  @IsEnum([1, 2], { message: CATEGORY.INVALID_LEVEL })
  level!: 1 | 2;

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

  @ValidateIf((o) => o.level === 2)
  @IsEnum(SERVICE_TYPE, { message: "Invalid service type." })
  serviceType?: ServiceType;

  @ValidateIf((o) => o.level === 2)
  @IsEnum(PRICING_MODE, { message: "Invalid pricing mode." })
  pricingMode?: PricingMode;

  @ValidateIf((o) => o.level === 2)
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Rate varianceLimit percent must be non-negative." })
  @Max(100, { message: "Rate varianceLimit percent cannot exceed 100%." })
  priceVarianceLimit?: number;

  @ValidateIf((o) => o.level === 2)
  @Type(() => Number)
  @IsInt()
  @IsPositive({ message: "Estimated duration is required." })
  estimatedDuration?: number;

  @ValidateIf((o) => o.level === 2)
  @Type(() => Number)
  @IsInt()
  @Min(0, { message: "Buffer time is required." })
  bufferTime?: number;

  @ValidateIf((o) => o.level === 2)
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: "Travel rate per KM is required." })
  travelRatePerKM?: number;

  @ValidateIf((o) => o.level === 2)
  @IsBoolean()
  allowBulkOffers?: boolean;

  @ValidateIf((o) => o.level === 2)
  @IsBoolean()
  allowSuddenBooking?: boolean;

  @Validate(CategoryRules)
  private _rules!: boolean;
}
