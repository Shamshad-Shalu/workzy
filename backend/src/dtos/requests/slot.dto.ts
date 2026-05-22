import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

import { ROLE, Role } from "@/constants";

export class CreateSlotDTO {
  @IsMongoId()
  workerId!: string;

  @IsMongoId()
  serviceId!: string;

  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  date!: Date;

  @IsString()
  startTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  itemCount?: number;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}

export class CreateQuoteSlotsDTO {
  @IsMongoId()
  serviceId!: string;

  @IsMongoId()
  bookingId!: string;

  @IsArray()
  @Type(() => Date)
  @IsDate({ message: "each date must be a valid date" })
  dates!: Date[];

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}
export class RescheduleSlotDto {
  @IsEnum(ROLE)
  requestedBy!: Role;

  @Type(() => Date)
  @IsDate({ message: "date must be a valid date" })
  date!: Date;

  @IsBoolean()
  isFullDay!: boolean;

  @IsString()
  startTime?: string;
}
