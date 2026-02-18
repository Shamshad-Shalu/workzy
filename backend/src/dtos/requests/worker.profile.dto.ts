import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";

class AvailabilitySlotDTO {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "startTime must be HH:MM" })
  startTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "endTime must be HH:MM" })
  endTime!: string;
}

class AvailabilityDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  monday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  tuesday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  wednesday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  thursday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  friday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  saturday!: AvailabilitySlotDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDTO)
  sunday!: AvailabilitySlotDTO[];
}

export class WorkerProfileRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid name format." })
  displayName?: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid tagline name format." })
  tagline?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.about !== undefined && o.about !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  about?: string;

  @IsNumber({}, { message: "Amount is required" })
  defaultRate!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityDTO)
  availability?: AvailabilityDTO;

  @ArrayMinSize(1, { message: "At least one cities is required." })
  @ArrayMaxSize(10, { message: "A maximum of 50 skills are allowed." })
  cities!: string[];

  @IsString()
  coverImage?: string | null;
}
