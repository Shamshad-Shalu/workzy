import { ROLE } from "@/constants";
import { type MessageType, type SenderRole } from "@/constants/chat";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { IChatMessage } from "@/types/chat/chatMessage.entity";
import { resolveS3Image } from "@/utils/s3.utils";

interface SenderInfo {
  name: string;
  profileImage?: string;
}

export type ChatMessageWithSender = IChatMessage & { senderInfo: SenderInfo };

export class ChatMessageResponseDTO {
  id!: string;
  type!: MessageType;
  role!: SenderRole;
  sender!: {
    id: string;
    name: string;
    profileImage?: string;
  };
  content?: string;
  mediaUrl?: string;
  isRead!: boolean;
  isDeleted!: boolean;
  createdAt!: Date;

  static async fromEntity(
    entity: ChatMessageWithSender,
    s3Service: IS3Service
  ): Promise<ChatMessageResponseDTO> {
    const dto = new ChatMessageResponseDTO();

    dto.id = entity._id.toString();
    dto.type = entity.type;
    dto.role = entity.role;
    dto.sender = {
      id: entity.senderId.toString(),
      name: entity.senderInfo.name,
      profileImage:
        entity.role === ROLE.WORKER
          ? entity.senderInfo.profileImage
          : await resolveS3Image(entity.senderInfo.profileImage, s3Service),
    };
    dto.content = entity.content;
    dto.mediaUrl = entity.mediaUrl;
    dto.isRead = entity.isRead;
    dto.isDeleted = entity.isDeleted;
    dto.createdAt = entity.createdAt;
    return dto;
  }
  static async fromEntities(
    entities: ChatMessageWithSender[],
    s3Service: IS3Service
  ): Promise<ChatMessageResponseDTO[]> {
    return await Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
