import { DEFAULT_IMAGE_URL, Role } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { generateSignedUrl } from "@/services/s3.dservice";
import { IUser } from "@/types/user";
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

  static async fromEntity(
    entity: IUser & { workerId?: string },
    s3Service: IS3Service
  ): Promise<LoginResponseDTO> {
    const dto = new LoginResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.role = entity.role;
    dto.isPremium = entity.isPremium;
    dto.workerId = entity.workerId;

    const image = entity.profileImage;

    if (!image) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (image?.includes(".amazonaws.com")) {
      // dto.profileImage = await generateSignedUrl(image)
      dto.profileImage = await s3Service.generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      dto.profileImage = image;
    }

    return dto;
  }
}
