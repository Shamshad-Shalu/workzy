import { Role } from "@/constants";
import { IUser } from "@/types/user";
import { Expose } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

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

export class LoginResponseDTO {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  profileImage!: string | undefined;

  @IsString()
  role!: Role;

  @IsBoolean()
  isPremium!: boolean;

  @IsOptional()
  @IsString()
  workerId?: string;

  static fromEntity(entity: IUser & { workerId?: string }): LoginResponseDTO {
    const dto = new LoginResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.profileImage = entity.profileImage;
    dto.role = entity.role;
    dto.isPremium = entity.isPremium;
    dto.workerId = entity.workerId;
    return dto;
  }
}
