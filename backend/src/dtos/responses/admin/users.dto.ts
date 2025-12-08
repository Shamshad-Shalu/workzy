import { DEFAULT_IMAGE_URL, Role } from "@/constants";
import { generateSignedUrl } from "@/services/s3.service";
import { IUser } from "@/types/user";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsersResponseDTO {
  @IsString()
  _id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEmail()
  phone!: string;

  @IsString()
  profileImage!: string | undefined;

  @IsBoolean()
  isPremium!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isBlocked!: boolean;

  @IsNotEmpty()
  @IsString()
  createdAt!: Date;

  static async fromEntity(entity: IUser): Promise<UsersResponseDTO> {
    const dto = new UsersResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.isPremium = entity.isPremium;
    dto.isBlocked = entity.isBlocked;
    dto.phone = entity.phone || "-";
    dto.createdAt = entity.createdAt;

    const image = entity.profileImage;
    if (!image) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (image?.startsWith("private/user")) {
      dto.profileImage = await generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      dto.profileImage = image;
    }

    return dto;
  }

  static async fromEntities(entities: IUser[]): Promise<UsersResponseDTO[]> {
    const promises = entities.map((entity) => this.fromEntity(entity));
    return Promise.all(promises);
  }
}
