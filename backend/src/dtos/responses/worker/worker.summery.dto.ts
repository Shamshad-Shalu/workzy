import dayjs from "dayjs";

import { DEFAULT_IMAGE_URL, DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { WorkerSummaryEntity } from "@/types/worker";

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
  completionRate!: number | null;
  reviewCount!: number;
  worksCompleted!: number;

  static async fromEntity(
    entity: WorkerSummaryEntity,
    s3Service: IS3Service
  ): Promise<WorkerSummaryResponseDTO> {
    const dto = new WorkerSummaryResponseDTO();

    const address = entity.profile?.address;
    const formattedAddress = address
      ? `${address.place}, ${address.city}, ${address.state} - ${address.pincode}`
      : "";

    const profileImage = entity.profileImage?.includes("private")
      ? await s3Service.generateSignedUrl(entity.profileImage)
      : entity.profileImage || DEFAULT_IMAGE_URL;

    const yearsSinceJoining = dayjs().diff(entity.createdAt, "year");
    const totalExperience = (entity.experience ?? 0) + yearsSinceJoining;

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.tagline = entity.tagline || "";
    dto.about = entity.about || "";
    dto.profileImage = profileImage;
    dto.coverImage = entity.coverImage || DEFAULT_WORKER_COVER_IMAGE;

    dto.skills = entity.skills;
    dto.cities = entity.cities;
    dto.address = formattedAddress;
    dto.experience = totalExperience;
    dto.rate = entity.defaultRate;
    dto.isPremium = entity.isPremium;

    dto.averageRating = entity.averageRating;
    dto.completionRate = entity.completionRate ?? null;
    dto.reviewCount = entity.reviewCount;
    dto.worksCompleted = entity.worksCompleted;

    return dto;
  }
}
