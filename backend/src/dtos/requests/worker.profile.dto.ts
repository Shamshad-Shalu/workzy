import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { IAvailabilitySlots, IRate } from "@/types/worker";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

export class WorkerProfileRequestDTO {
  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid name format." })
  name?: string;

  @IsString()
  @Matches(SERVICE_NAME_REGEX, { message: "Invalid tagline name format." })
  tagline?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.about !== undefined && o.about !== "")
  @Matches(DESCRIPTION_REGEX, { message: "Invalid description format." })
  about?: string;
  defaultRate!: IRate;
  availability?: IAvailabilitySlots;

  @ArrayMinSize(2, { message: "At least 2 skill is required." })
  @ArrayMaxSize(12, { message: "A maximum of 50 skills are allowed." })
  skills!: string[];

  @ArrayMinSize(1, { message: "At least one cities is required." })
  @ArrayMaxSize(10, { message: "A maximum of 50 skills are allowed." })
  cities!: string[];
}
