import { Role } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { UserListItem } from "@/types/user/user.projection";
import { resolveS3Url } from "@/utils/s3.utils";

export class UsersResponseDTO {
  id!: string;
  name!: string;
  email!: string;
  role!: Role;
  phone?: string;
  profileImage?: string;
  isBlocked!: boolean;
  createdAt!: Date;

  static async fromEntity(entity: UserListItem, s3Service: IS3Service): Promise<UsersResponseDTO> {
    const dto = new UsersResponseDTO();

    dto.id = entity._id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.role = entity.role;
    dto.profileImage = await resolveS3Url(entity.profileImage, s3Service);
    dto.isBlocked = entity.isBlocked;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  static async fromEntities(
    entities: UserListItem[],
    s3Service: IS3Service
  ): Promise<UsersResponseDTO[]> {
    const promises = entities.map((entity) => this.fromEntity(entity, s3Service));
    return Promise.all(promises);
  }
}
