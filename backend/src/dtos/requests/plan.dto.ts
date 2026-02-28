import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
  IsDate,
} from "class-validator";

import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";

class PlanPriceDTO {
  @IsNumber()
  @Min(1)
  monthly!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quarterly?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  halfYearly?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  yearly?: number;
}

class RegularPlanPriceDTO {
  @IsNumber()
  @Min(1)
  monthly!: number;

  @IsNumber()
  @Min(1)
  quarterly!: number;

  @IsNumber()
  @Min(1)
  halfYearly!: number;

  @IsNumber()
  @Min(1)
  yearly!: number;
}

export class PlanRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid plan name format." })
  name!: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.description?.trim() !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  description?: string;

  @IsBoolean()
  isSpecialOffer!: boolean;

  @IsBoolean()
  isActive!: boolean;

  @ValidateNested()
  @Type((options) => (options?.object.isSpecialOffer ? PlanPriceDTO : RegularPlanPriceDTO))
  price!: PlanPriceDTO | RegularPlanPriceDTO;

  @IsOptional()
  @ValidateIf((o) => o.isSpecialOffer)
  @Type(() => Date)
  @IsDate({ message: "validFrom must be a valid date" })
  validFrom?: Date;

  @IsOptional()
  @ValidateIf((o) => o.isSpecialOffer)
  @Type(() => Date)
  @IsDate({ message: "validTill must be a valid date" })
  validTill?: Date;
}
