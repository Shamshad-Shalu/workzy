import { Type } from "class-transformer";
import {
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

class AvailabilitySlotDto {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "startTime must be HH:MM" })
  startTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "endTime must be HH:MM" })
  endTime!: string;
}

class AvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  monday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  tuesday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  wednesday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  thursday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  friday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  saturday!: AvailabilitySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  sunday!: AvailabilitySlotDto[];
}

class GeoLocationDto {
  @IsString()
  type!: "Point";

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];

  @IsString()
  addressLabel!: string;
}

export class WorkerProfileRequestDto {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid name format." })
  displayName!: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid tagline name format." })
  tagline!: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.about !== undefined && o.about !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  about!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto;

  @ValidateNested()
  @Type(() => GeoLocationDto)
  location!: GeoLocationDto;

  @IsString()
  coverImage?: string | null;
}
