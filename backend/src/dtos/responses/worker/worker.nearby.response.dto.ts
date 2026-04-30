import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { NearbyWorkerItem } from "@/types/worker/worker.projection";
import { resolveS3Image } from "@/utils/s3.utils";

export class NearbyWorkerResponseDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  profileImage?: string;
  experience!: number;
  distance!: number;
  completedJobs!: number;
  averageRating!: number;

  static async fromEntity(
    entity: NearbyWorkerItem,
    s3Service: IS3Service
  ): Promise<NearbyWorkerResponseDTO> {
    const dto = new NearbyWorkerResponseDTO();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.experience = entity.experience;
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
    dto.distance = Math.round(entity.distance * 10) / 10;
    dto.completedJobs = entity.completedJobs;
    dto.averageRating = entity.averageRating;

    return dto;
  }

  static async fromEntities(
    entities: NearbyWorkerItem[],
    s3Service: IS3Service
  ): Promise<NearbyWorkerResponseDTO[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
