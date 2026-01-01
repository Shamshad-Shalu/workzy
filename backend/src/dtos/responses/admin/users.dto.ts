import { DEFAULT_IMAGE_URL } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IUser } from "@/types/user";
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

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

  static async fromEntity(entity: IUser, s3Service: IS3Service): Promise<UsersResponseDTO> {
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
    } else if (image?.includes(".amazonaws.com")) {
      dto.profileImage = await s3Service.generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      // google user
      dto.profileImage = image;
    }

    return dto;
  }

  static async fromEntities(entities: IUser[], s3Service: IS3Service): Promise<UsersResponseDTO[]> {
    const promises = entities.map((entity) => this.fromEntity(entity, s3Service));
    return Promise.all(promises);
  }
}
