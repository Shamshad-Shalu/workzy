import { Role } from "@/constants";
import { Expose } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterResponseDTO {
  @Expose()
  @IsString()
  _id!: string;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  role!: Role;
}
