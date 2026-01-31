import {
  IsBoolean,
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
} from "class-validator";

import { BULK_DISCOUNT, DESCRIPTION_REGEX } from "@/constants";

export class BulkDiscountDTO {
  @IsInt()
  @Min(BULK_DISCOUNT.MIN_COUNT)
  @Max(BULK_DISCOUNT.MAX_COUNT)
  count!: number;

  @IsInt()
  @Min(BULK_DISCOUNT.MIN_PERCENT)
  @Max(BULK_DISCOUNT.MIN_PERCENT)
  percent!: number;
}

@ValidatorConstraint({ name: "progressiveDiscount", async: false })
class ProgressiveDiscountValidator implements ValidatorConstraintInterface {
  validate(discounts: BulkDiscountDTO[]) {
    if (!discounts) return true;

    const sorted = discounts.sort((a, b) => a.count - b.count);

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].percent <= sorted[i - 1].percent) {
        return false;
      }
    }
    return true;
  }

  defaultMessage() {
    return "Bulk discount percent must increase with service count";
  }
}

export class ServiceRequestDTO {
  @IsMongoId()
  categoryId!: string;

  @IsNumber()
  @Min(0)
  rate!: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.description !== undefined && o.description !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  estimatedDuration?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bufferTime?: number;

  @IsNumber()
  @Min(0)
  maxTravelRadius!: number;

  @IsOptional()
  @Validate(ProgressiveDiscountValidator)
  bulkDiscounts?: BulkDiscountDTO[];

  @IsOptional()
  @IsBoolean()
  allowSuddenBooking?: boolean;

  @IsBoolean()
  isActive: boolean = true;

  @IsNumber()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxTravelCost?: number | null;
}
