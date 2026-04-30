import { Role } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IAdress, ILocation, IUser } from "@/types/user/user.entity";
import { resolveS3Image } from "@/utils/s3.utils";

export class RegisterResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
}

export class LoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  phone?: string;
  profileImage?: string;
  profile?: {
    address: IAdress;
    location: ILocation;
  };
  worker?: {
    id: string;
    displayName: string;
    profileImage?: string;
  };

  static async fromEntity(
    entity: IUser & { workerData?: { _id: string; displayName: string; profileImage?: string } },
    s3Service: IS3Service
  ): Promise<LoginResponseDto> {
    const dto = new LoginResponseDto();
    dto.id = entity._id.toString();
    dto.name = entity.name;
    dto.email = entity.email;
    dto.role = entity.role;
    dto.phone = entity.phone;
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
    dto.profile = entity.profile;

    if (entity.workerData) {
      dto.worker = {
        id: entity.workerData._id.toString(),
        displayName: entity.workerData.displayName,
        profileImage: entity.workerData.profileImage,
      };
    }

    return dto;
  }
}
