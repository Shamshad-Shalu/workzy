import { DEFAULT_WORKER_COVER_IMAGE, WorkerStatus } from "@/constants";
import {
  IAvailabilitySlots,
  IGeoLocation,
  IReviewStats,
  IWorker,
} from "@/types/worker/worker.entity";
import { WorkerProfile } from "@/types/worker/worker.projection";
import { getTodayKey } from "@/utils/time.utils";

export class WorkerProfileResponseDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  about!: string;
  experience!: number;
  profileImage?: string;
  coverImage!: string;
  addressLabel!: string;
  reviewStats!: Omit<IReviewStats, "totalRating">;
  isAvailableToday!: boolean;
  jobStats!: {
    offered: number;
    accepted: number;
    completed: number;
    noResponse: number;
    complitionRate: number;
  };

  static fromEntity(entity: WorkerProfile): WorkerProfileResponseDTO {
    const dto = new WorkerProfileResponseDTO();
    const { completed, accepted, noResponse, offered } = entity.jobStats;
    const { averageRating, breakdown, reviewCount } = entity.reviewStats;

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.experience = entity.experience || 0;
    dto.profileImage = entity.profileImage;
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;
    dto.addressLabel = entity.location.addressLabel ?? "";
    dto.jobStats = {
      accepted,
      completed,
      noResponse,
      offered,
      complitionRate: accepted > 0 ? Number(((completed / accepted) * 100).toFixed(1)) : 0,
    };
    dto.isAvailableToday = entity.availability[getTodayKey()].length > 0;
    dto.reviewStats = {
      averageRating: Math.round((averageRating ?? 0) * 10) / 10,
      breakdown,
      reviewCount,
    };
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

  static async fromEntity(entity: IWorker): Promise<WorkerDetailsResponseDto> {
    const dto = new WorkerDetailsResponseDto();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.phone = entity.phone;
    dto.experience = entity.experience || 0;
    dto.profileImage = entity?.profileImage;
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;

    dto.location = entity.location;
    dto.status = entity.status;
    dto.availability = entity.availability;
    dto.rejectReason = entity.rejectReason;
    dto.suspensionReason = entity.suspensionReason;

    return dto;
  }
}
