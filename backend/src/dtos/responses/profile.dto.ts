import { Expose } from "class-transformer";
import { IAdress, ILocation, IUser } from "@/types/user";
import { generateSignedUrl } from "@/services/s3.service";
import { DEFAULT_IMAGE_URL } from "@/constants";

export class UserProfileResponseDTO {
  @Expose() _id!: string;
  @Expose() name!: string;
  @Expose() email!: string;
  @Expose() phone?: string;
  @Expose() role!: string;
  @Expose() profileImage!: string;
  @Expose() isPremium!: boolean;
  @Expose() profile?: { address?: IAdress; location: ILocation };

  static async fromEntity(user: IUser): Promise<UserProfileResponseDTO> {
    const dto = new UserProfileResponseDTO();

    dto._id = user._id.toString();
    dto.name = user.name;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.role = user.role;
    dto.isPremium = user.isPremium;
    dto.profile = user.profile;

    const image = user.profileImage;

    if (!image) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (image?.includes(".amazonaws.com")) {
      dto.profileImage = await generateSignedUrl(image);
    } else if (image?.startsWith("http")) {
      dto.profileImage = image;
    }

    return dto;
  }
}
