import dayjs from "dayjs";

import { DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { WorkerSummaryEntity } from "@/types/worker";
import { resolveS3Image } from "@/utils/s3.utils";

export class WorkerSummaryResponseDTO {
  id!: string;
  displayName!: string;
  tagline!: string;
  about!: string;
  profileImage!: string;
  coverImage!: string;
  experience!: number;
  rate!: number;
  skills!: string[];
  cities!: string[];
  address!: string;
  isPremium!: boolean;

  averageRating!: number;
  reviewCount!: number;

  completionRate!: number | null;
  workCompleted!: number;

  static async fromEntity(
    entity: WorkerSummaryEntity,
    s3Service: IS3Service
  ): Promise<WorkerSummaryResponseDTO> {
    const dto = new WorkerSummaryResponseDTO();

    const address = entity.profile?.address;
    const formattedAddress = address
      ? `${address.place}, ${address.city}, ${address.state} - ${address.pincode}`
      : "";

    const yearsSinceJoining = dayjs().diff(entity.createdAt, "year");
    const totalExperience = (entity.experience ?? 0) + yearsSinceJoining;

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;

    dto.skills = entity.skills;
    dto.cities = entity.cities;
    dto.address = formattedAddress;
    dto.experience = totalExperience;
    dto.rate = entity.defaultRate;
    dto.isPremium = entity.isPremium;

    dto.averageRating = entity.averageRating;
    dto.reviewCount = entity.reviewCount;
    dto.workCompleted = entity.jobsCompleted;
    dto.completionRate =
      entity.jobsAccepted > 0
        ? Math.round((entity.jobsCompleted / entity.jobsAccepted) * 100)
        : null;

    return dto;
  }
}
