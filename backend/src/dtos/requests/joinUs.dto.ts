import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { DocumentType, WorkerStatus } from "@/types/worker";
import { Type } from "class-transformer";
import {
  IsString,
  Matches,
  IsUrl,
  IsNumber,
  Min,
  IsEnum,
  ValidateNested,
  IsOptional,
} from "class-validator";

class RateDTO {
  @IsNumber({}, { message: "Amount is required" })
  @Min(1, { message: "Rate must be a valid amount" })
  amount!: number;

  @IsEnum(["hourly", "fixed"], { message: "Type must be hourly or fixed" })
  type!: "hourly" | "fixed";
}

export class JoinUsDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Pls Enter valid name" })
  displayName!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Pls Enter valid name" })
  tagline!: string;

  @IsString()
  @Matches(DESCRIPTION_REGEX, { message: "Please Enter valid description" })
  about!: string;

  @IsString()
  @IsUrl()
  document!: string;

  @ValidateNested()
  @Type(() => RateDTO)
  defaultRate!: RateDTO;
}

export class ResubmitDocument {
  @IsString()
  id!: string;

  @IsString()
  @IsUrl()
  url!: string;

  @IsOptional()
  WorkerStatus?: WorkerStatus;

  @IsOptional()
  type?: DocumentType;
}
