import { Type } from "class-transformer";
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
  IsIn,
  Length,
} from "class-validator";

import { PLACE_REGEX } from "@/constants";
import { PasswordRule } from "@/validations/rules";

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @PasswordRule()
  newPassword!: string;
}

export class VerifyOtpDto {
  @IsIn(["email", "phone"], {
    message: "Type must be either 'email' or 'phone'",
  })
  type!: "email" | "phone";

  @IsString()
  @Length(3, 100, {
    message: "Contact must be a valid email or phone",
  })
  contact!: string;

  @IsString()
  @Length(6, 6, {
    message: "OTP must be exactly 6 digits",
  })
  @Matches(/^[0-9]+$/, {
    message: "OTP must contain only numbers",
  })
  otp!: string;
}

export class LocationDto {
  @IsString()
  type!: "Point";

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates!: [number, number];
}

class AddressDto {
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

class ProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}

export class UserProfileRequestDto {
  @IsString()
  @MinLength(1, { message: "Name is required" })
  name!: string;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile!: ProfileDto;
}
