import { Expose } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

import { DEFAULT_IMAGE_URL, Role } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IUser } from "@/types/user";

export class RegisterResponseDTO {
  @Expose()
  @IsString()
  id!: string;

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
  id!: string;

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

  static async fromEntity(
    entity: IUser & { workerId?: string },
    s3Service: IS3Service
  ): Promise<LoginResponseDTO> {
    const dto = new LoginResponseDTO();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.email = entity.email;
    dto.role = entity.role;
    dto.isPremium = entity.isPremium;
    dto.workerId = entity.workerId;

    const image = entity.profileImage;

    if (!image) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (image?.includes("private/user/profiles")) {
      dto.profileImage = await s3Service.generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      dto.profileImage = image;
    }

    return dto;
  }
}
