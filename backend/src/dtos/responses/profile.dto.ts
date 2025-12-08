import { Expose } from "class-transformer";
import { IUser } from "@/types/user";
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
  @Expose() profile!: any;

  static async fromEntity(user: IUser): Promise<UserProfileResponseDTO> {
    const dto = new UserProfileResponseDTO();

    dto._id = user._id.toString();
    dto.name = user.name;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.role = user.role;
    dto.isPremium = user.isPremium;
    dto.profile = user.profile;

    const img = user.profileImage;

    if (!img) {
      dto.profileImage = DEFAULT_IMAGE_URL;
    } else if (img?.startsWith("private/user")) {
      dto.profileImage = await generateSignedUrl(img);
    } else if (img?.startsWith("http")) {
      dto.profileImage = img;
    }

    return dto;
  }
}
