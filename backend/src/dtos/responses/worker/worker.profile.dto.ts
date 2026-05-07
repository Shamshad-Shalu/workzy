import { Expose } from "class-transformer";

import { DEFAULT_WORKER_COVER_IMAGE, WorkerStatus } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IAvailabilitySlots, IGeoLocation, IWorker } from "@/types/worker/worker.entity";
import { WorkerProfile } from "@/types/worker/worker.projection";
import { resolveS3Image } from "@/utils/s3.utils";

export class WorkerProfileResponseDTO {
  @Expose() id!: string;
  @Expose() displayName!: string;
  @Expose() tagline!: string;
  @Expose() about!: string;
  @Expose() experience!: number;
  @Expose() profileImage?: string;
  @Expose() coverImage!: string;
  @Expose() addressLabel!: string;
  @Expose() averageRating!: number;
  @Expose() totalReviews!: number;
  @Expose() completedJobs!: number;
  @Expose() complitionRate!: number;

  static fromEntity(entity: WorkerProfile): WorkerProfileResponseDTO {
    const dto = new WorkerProfileResponseDTO();
    const { completed, accepted } = entity.jobStats;

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.experience = entity.experience || 0;
    dto.profileImage = entity.profileImage;
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    dto.addressLabel = entity.location.addressLabel ?? "";
    dto.completedJobs = completed ?? 0;
    dto.complitionRate = accepted > 0 ? Number(((completed / accepted) * 100).toFixed(1)) : 0;
    dto.averageRating = Math.round((entity.reviewStats.averageRating ?? 0) * 10) / 10;
    dto.totalReviews = entity.reviewStats.reviewCount ?? 0;

    return dto;
  }
}

export class WorkerDetailsResponseDto {
  id!: string;
  displayName!: string;
  tagline!: string;
  about!: string;
  experience!: number;
  phone!: string;
  profileImage?: string;
  coverImage!: string;
  location!: IGeoLocation;
  status!: WorkerStatus;
  availability!: IAvailabilitySlots;
  rejectReason?: string;
  suspensionReason?: string;

  static async fromEntity(
    entity: IWorker,
    s3Service: IS3Service
  ): Promise<WorkerDetailsResponseDto> {
    const dto = new WorkerDetailsResponseDto();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.phone = entity.phone;
    dto.experience = entity.experience || 0;
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;

    dto.location = entity.location;
    dto.status = entity.status;
    dto.availability = entity.availability;
    dto.rejectReason = entity.rejectReason;
    dto.suspensionReason = entity.suspensionReason;

    return dto;
  }
}
