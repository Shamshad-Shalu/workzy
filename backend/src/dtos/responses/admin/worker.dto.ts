import { StripeAccountStatus, WorkerStatus } from "@/constants";
import { WorkerListItem } from "@/types/worker/worker.projection";

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

  static fromEntity(entity: WorkerListItem): WorkerListResponseDto {
    const dto = new WorkerListResponseDto();

    dto.id = entity._id.toString();
    dto.displayName = entity.displayName;
    dto.userId = entity.userId._id.toString();
    dto.email = entity.userId.email;
    dto.profileImage = entity.profileImage;
    dto.stripeAccountStatus = entity.stripeAccountStatus;
    dto.status = entity.status;
    dto.phone = entity.phone;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static fromEntities(entities: WorkerListItem[]): WorkerListResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
