import { INotification } from "@/types/notification/notification.entity";

export class NotificationResponseDto {
  id!: string;
  type!: string;
  recipientId!: string;
  heading!: string;
  message!: string;
  read!: boolean;
  createdAt!: Date;

  static fromEntity(entity: INotification): NotificationResponseDto {
    const dto = new NotificationResponseDto();

    dto.id = entity._id.toString();
    dto.type = entity.type;
    dto.recipientId = entity.recipientId?.toString();
    dto.heading = entity.heading;
    dto.message = entity.message;
    dto.read = entity.read;
    dto.createdAt = entity.createdAt;
    return dto;
  }
  static fromEntities(entities: INotification[]) {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
