import { MessageType, SenderRole } from "@/constants";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { ChatListItem } from "@/types/chat/chat.projection";
import { resolveS3Url } from "@/utils/s3.utils";

export interface ChatRoomListItem {
  chat: ChatListItem;
  unread?: number;
}

export class ChatResponseDTO {
  id!: string;
  chatId!: string;
  participants!: {
    user: {
      id: string;
      name: string;
      profileImage?: string;
    };
    worker: {
      id: string;
      name: string;
      profileImage?: string;
    };
  };
  isBlocked!: boolean;
  blockedBy?: SenderRole;
  unread?: number;
  lastMessage?: {
    messageId: string;
    type: MessageType;
    role: SenderRole;
    content?: string;
    createdAt: Date;
    isDeleted: boolean;
  };
  static async fromEntity(
    { chat, unread }: ChatRoomListItem,
    s3Service: IS3Service
  ): Promise<ChatResponseDTO> {
    const dto = new ChatResponseDTO();
    const { lastMessage } = chat;

    dto.id = chat._id.toString();
    dto.chatId = chat.chatId;
    dto.participants = {
      user: {
        id: chat.userId._id.toString(),
        name: chat.userId.name,
        profileImage: await resolveS3Url(chat.userId.profileImage, s3Service),
      },
      worker: {
        id: chat.workerId._id.toString(),
        name: chat.workerId.displayName,
        profileImage: chat.workerId.profileImage,
      },
    };
    dto.isBlocked = chat.isBlocked;
    dto.blockedBy = chat.blockedBy;
    dto.unread = unread;
    dto.lastMessage = lastMessage
      ? {
          ...lastMessage,
          messageId: lastMessage.messageId.toString(),
          content: lastMessage.isDeleted ? undefined : lastMessage.content,
        }
      : undefined;
    return dto;
  }

  static async fromEntities(
    entities: ChatRoomListItem[],
    s3Service: IS3Service
  ): Promise<ChatResponseDTO[]> {
    return await Promise.all(entities.map((entity) => this.fromEntity(entity, s3Service)));
  }
}
