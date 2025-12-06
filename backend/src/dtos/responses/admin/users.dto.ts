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
  createdAt!: string;

  static async fromEntity(entity: IUser, defaultSignedUrl: string): Promise<UsersResponseDTO> {
    const dto = new UsersResponseDTO();

    dto._id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.isPremium = entity.isPremium;
    dto.isBlocked = entity.isBlocked;
    dto.phone = entity.phone || "-";
    const date = new Date(entity.createdAt);
    dto.createdAt = date.toLocaleDateString("en-GB").replace(/\//g, " - ");

    const image = entity.profileImage;

    if (image && image.includes("amazonaws.com")) {
      const key = image.split(".amazonaws.com/")[1];
      dto.profileImage = await generateSignedUrl(key);
    } else if (image && image.startsWith("http")) {
      dto.profileImage = image;
    } else {
      dto.profileImage = defaultSignedUrl;
    }

    return dto;
  }

  static async fromEntities(entities: IUser[]): Promise<UsersResponseDTO[]> {
    const defaultSignedUrl = await generateSignedUrl(DEFAULT_IMAGE_URL);
    const promises = entities.map((entity) => this.fromEntity(entity, defaultSignedUrl));
    return Promise.all(promises);
  }
}
