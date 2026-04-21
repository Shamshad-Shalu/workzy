import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { NearbyWorkerEntity } from "@/types/worker";
import { resolveS3Image } from "@/utils/s3.utils";

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
    dto.id = entity._id.toString();
    dto.workerId = entity.workerId.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.experience = entity.experience;

    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
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
