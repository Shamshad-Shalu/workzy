import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IAdress, ILocation, IUser } from "@/types/user/user.entity";
import { resolveS3Image } from "@/utils/s3.utils";

export class UserProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  role!: string;
  profileImage?: string;
  profile?: { address?: IAdress; location: ILocation };

  static async fromEntity(entity: IUser, s3Service: IS3Service): Promise<UserProfileResponseDto> {
    const dto = new UserProfileResponseDto();

    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.role = entity.role;
    dto.profile = entity.profile;
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);

    return dto;
  }
}
