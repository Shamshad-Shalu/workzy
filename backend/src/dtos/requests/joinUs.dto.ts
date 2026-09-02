import { Type } from "class-transformer";
import {
  IsString,
  Matches,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
  Max,
  ValidateNested,
  IsArray,
  ValidateIf,
} from "class-validator";

import { DESCRIPTION_REGEX, SERVICE_NAME_REGEX } from "@/constants";
import { PhoneRule } from "@/validations/rules";

import { GeoLocationDto } from "./worker.profile.dto";

class WorkerDocumentDTO {
  @IsUrl({}, { message: "Document URL must be a valid URL" })
  aadhaar!: string;

  @IsUrl({}, { message: "Document URL must be a valid URL" })
  pan!: string;

  @IsUrl({}, { message: "Document URL must be a valid URL" })
  selfie!: string;

  @IsUrl({}, { message: "Document URL must be a valid URL" })
  profile!: string;
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

  @IsNumber()
  @Min(0, { message: "Experience cannot be negative" })
  @Max(100, { message: "Experience seems too high" })
  experience!: number;

  @ValidateNested()
  @Type(() => GeoLocationDto)
  location!: GeoLocationDto;

  @IsOptional()
  @ValidateIf(
    (o) => o.profileImage !== "" && o.profileImage !== null && o.profileImage !== undefined
  )
  @IsUrl({}, { message: "Profile image must be a valid URL" })
  profileImage?: string;

  @ValidateNested()
  @Type(() => WorkerDocumentDTO)
  documents!: WorkerDocumentDTO;

  @IsString()
  @PhoneRule()
  phone!: string;

  @IsArray()
  @IsString({ each: true })
  languages!: string[];
}
