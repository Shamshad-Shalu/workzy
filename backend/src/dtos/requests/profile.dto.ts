import { PasswordRule } from "@/validations/rules";
import {
  IsString,
  IsOptional,
  MinLength,
  Matches,
  IsArray,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PLACE_REGEX } from "@/constants";

export class ChangePasswordDTO {
  @IsString()
  currentPassword!: string;

  @IsString()
  @PasswordRule()
  newPassword!: string;
}

class AddressDTO {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "House address must be at least 3 characters" })
  @Matches(PLACE_REGEX, {
    message:
      "House address can only contain letters, numbers, spaces, and common symbols (# - / . ,)",
  })
  house?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Place must be at least 3 characters" })
  @Matches(PLACE_REGEX, { message: "Place should contain letters and spaces only" })
  place?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "City must be at least 3 characters" })
  @Matches(PLACE_REGEX, { message: "City should contain letters and spaces only" })
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: "Pincode must be exactly 6 digits" })
  pincode?: string;
}

class LocationDTO {
  @IsString()
  type!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates!: [number, number];
}

export class ProfileRequestDTO {
  @IsString()
  @MinLength(1, { message: "Name is required" })
  name!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO;

  @ValidateNested()
  @Type(() => LocationDTO)
  location!: LocationDTO;
}
