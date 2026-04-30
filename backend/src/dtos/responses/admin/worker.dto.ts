import { StripeAccountStatus, WorkerStatus } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { WorkerListItem } from "@/types/worker/worker.projection";
import { resolveS3Image } from "@/utils/s3.utils";

export class WorkerListResponseDto {
  id!: string;
  displayName!: string;
  profileImage?: string;
  status!: WorkerStatus;
  userId!: string;
  email!: string;
  phone?: string;
  stripeAccountStatus!: StripeAccountStatus;
  createdAt!: Date;

  static async fromEntity(
    entity: WorkerListItem,
    s3Service: IS3Service
  ): Promise<WorkerListResponseDto> {
    const dto = new WorkerListResponseDto();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.userId = entity.userId._id.toString();
    dto.email = entity.userId.email;
    dto.profileImage = await resolveS3Image(entity.profileImage, s3Service);
    dto.stripeAccountStatus = entity.stripeAccountStatus;
    dto.status = entity.status;
    dto.phone = entity.phone;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static async fromEntities(
    entities: WorkerListItem[],
    s3Service: IS3Service
  ): Promise<WorkerListResponseDto[]> {
    return Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
