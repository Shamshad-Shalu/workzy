import { Type } from "class-transformer";
import {
  IsDate,
  IsInt,
  IsMongoId,
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
