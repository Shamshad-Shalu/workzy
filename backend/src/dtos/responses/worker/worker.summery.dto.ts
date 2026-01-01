import { Expose } from "class-transformer";
import { DEFAULT_IMAGE_URL, DEFAULT_WORKER_COVER_IMAGE } from "@/constants";
import { IRate, IWorker } from "@/types/worker";
import { IUser } from "@/types/user";
import { IS3Service } from "@/core/interfaces/services/IS3Service";

export interface WorkerAdditionalInfo {
  jobsCompleted: number;
  averageRating: number;
  completionRate: number;
  finalRate?: IRate;
  rating: number;
  reviewsCount: number;
  responseTime: string;
  availability?: string;
}

export class WorkerSummaryResponseDTO {
  @Expose() workerInfo!: {
    _id: string;
    displayName: string;
    tagline: string;
    about: string;
    profileImage: string;
    coverImage: string;
    rate: IRate;
    skills: string[];
    cities: string[];
    availability: string;
    location: string;
    rating?: number;
    reviewsCount?: number;
    experience?: number;
    responseTime?: string;
    certificates?: string[];
  };
  @Expose() workerStats!: {
    jobsCompleted: number;
    averageRating: number;
    completionRate: number;
  };

  static async format(
    worker: IWorker,
    user: IUser,
    stats: WorkerAdditionalInfo,
    s3Service: IS3Service
  ): Promise<WorkerSummaryResponseDTO> {
    const dto = new WorkerSummaryResponseDTO();

    const address = user.profile?.address;
    const formattedAddress = address
      ? `${address.place}, ${address.city}, ${address.state} - ${address.pincode}`
      : "";

    const profileImage = user.profileImage?.includes("amazonaws.com")
      ? await s3Service.generateSignedUrl(user.profileImage)
      : user.profileImage || DEFAULT_IMAGE_URL;

    const experience =
      (worker.experience ?? 0) + (new Date().getFullYear() - worker.createdAt.getFullYear());

    dto.workerInfo = {
      _id: worker._id,
      displayName: worker.displayName,
      tagline: worker.tagline || "",
      about: worker.about || "",
      profileImage,
      coverImage: worker.coverImage || DEFAULT_WORKER_COVER_IMAGE,

      skills: worker.skills,
      cities: worker.cities,
      location: formattedAddress,
      experience,

      rate: stats.finalRate || worker.defaultRate,
      rating: stats.rating,
      availability: "available",
      reviewsCount: stats.reviewsCount,
      responseTime: stats.responseTime,
      certificates: worker.documents.flatMap((doc) => (doc.name ? [doc.name] : [])),
    };
    dto.workerStats = {
      jobsCompleted: stats.jobsCompleted,
      averageRating: stats.averageRating,
      completionRate: stats.completionRate,
    };

    return dto;
  }
}
