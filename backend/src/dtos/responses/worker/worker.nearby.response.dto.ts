import { DEFAULT_IMAGE_URL } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { NearbyWorkerEntity } from "@/types/worker";

export class NearbyWorkerResponseDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  workerId!: string;
  experience!: number;
  profileImage!: string;
  distance!: number;

  static async fromEntity(
    entity: NearbyWorkerEntity,
    s3Service: IS3Service
  ): Promise<NearbyWorkerResponseDTO> {
    const dto = new NearbyWorkerResponseDTO();

    const profileImage = entity.profileImage?.includes("private")
      ? await s3Service.generateSignedUrl(entity.profileImage)
      : entity.profileImage || DEFAULT_IMAGE_URL;

    dto.id = entity._id.toString();
    dto.workerId = entity.workerId.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.experience = entity.experience;

    dto.profileImage = profileImage;
    dto.distance = Math.round(entity.distance);

    return dto;
  }

  static async fromEntities(
    entities: NearbyWorkerEntity[],
    s3Service: IS3Service
  ): Promise<NearbyWorkerResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
