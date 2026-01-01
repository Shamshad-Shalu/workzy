import { Expose } from "class-transformer";
import { IAdress, ILocation, IUser } from "@/types/user";
import { DEFAULT_IMAGE_URL } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

export class UserProfileResponseDTO {
  @Expose() _id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() phone?: string;
  @Expose() age?: number;
  @Expose() role!: string;
  @Expose() profileImage!: string;
  @Expose() isPremium!: boolean;
  @Expose() profile?: { address?: IAdress; location: ILocation };

  static async fromEntity(user: IUser, s3Service: IS3Service): Promise<UserProfileResponseDTO> {
    const dto = new UserProfileResponseDTO();

    dto._id = user._id.toString();
    dto.name = user.name;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.role = user.role;
    dto.age = user.age || undefined;
    dto.isPremium = user.isPremium;
    dto.profile = user.profile;

    const image = user.profileImage;

    if (!image) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (image?.includes(".amazonaws.com")) {
      dto.profileImage = await s3Service.generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      dto.profileImage = image;
    }

    return dto;
  }
}
