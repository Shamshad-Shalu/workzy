import { NearbyWorkerItem } from "@/types/worker/worker.projection";

export class NearbyWorkerResponseDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  profileImage?: string;
  experience!: number;
  distance!: number;
  completedJobs!: number;
  averageRating!: number;

  static fromEntity(entity: NearbyWorkerItem): NearbyWorkerResponseDTO {
    const dto = new NearbyWorkerResponseDTO();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline;
    dto.experience = entity.experience;
    dto.profileImage = entity.profileImage;
    dto.distance = Math.round(entity.distance * 10) / 10;
    dto.completedJobs = entity.completedJobs;
    dto.averageRating = entity.averageRating;

    return dto;
  }

  static async fromEntities(entities: NearbyWorkerItem[]): Promise<NearbyWorkerResponseDTO[]> {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
