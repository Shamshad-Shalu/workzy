import { Role } from "@/constants";
import { IUser } from "@/types/user";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterResponseDTO {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  role!: Role;

  static fromEntity(entity: IUser): RegisterResponseDTO {
    const dto = new RegisterResponseDTO();
    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.role = entity.role;

    return dto;
  }
}
