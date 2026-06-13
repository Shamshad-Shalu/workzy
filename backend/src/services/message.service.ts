import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { CHAT, HTTPSTATUS, ROLE } from "@/constants";
import { MESSAGE_TYPE, MessageType, SenderRole } from "@/constants/chat";
import { IChatRepository } from "@/core/interfaces/repositories/IChatRepository";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { ChatMessageResponseDTO } from "@/dtos/responses/chatMessage.dto";
import { getIO } from "@/socket/socket";
import { MessageQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";
import CustomError from "@/utils/customError";
import { extractKeyFromUrl } from "@/utils/upload";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository,
    @inject(TYPES.ChatRepository) private _chatRepository: IChatRepository,
    @inject(TYPES.ChatService) private _chatService: IChatService,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async getMessages(input: MessageQuery): Promise<CursorPaginatedResult<ChatMessageResponseDTO>> {
    const { data, nextCursor } = await this._messageRepository.getMessages(input);
    return {
      data: await ChatMessageResponseDTO.fromEntities(data, this._s3Service, input.role),
      nextCursor,
    };
  }
  async getMessageContext(input: {
    chatId: string;
    messageId: string;
    limit: number;
    role: SenderRole;
  }): Promise<{ data: ChatMessageResponseDTO[]; nextCursor: string | null }> {
    const { chatId, messageId, limit, role } = input;
    const { data, nextCursor } = await this._messageRepository.getMessages({
      chatId,
      messageId,
      limit,
      role,
    });
    return {
      data: await ChatMessageResponseDTO.fromEntities(data, this._s3Service, role),
      nextCursor,
    };
  }

  async saveMessage(data: {
    chatId: string;
    senderId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
    replyToMessageId?: string;
  }): Promise<ChatMessageResponseDTO> {
    const { chatId, role, type, content, mediaUrl, replyToMessageId } = data;
    const mediaUrlKey = mediaUrl ? extractKeyFromUrl(mediaUrl) : undefined;

    let replyToSnapshot:
      | { messageId: Types.ObjectId; content?: string; type: MessageType; role: SenderRole }
      | undefined;

    if (replyToMessageId) {
      const replyMsg = await this._messageRepository.findById(replyToMessageId);
      if (!replyMsg || replyMsg.isDeleted) {
        throw new CustomError(CHAT.MESSAGE_NOT_FOUND, HTTPSTATUS.NOT_FOUND);
      }
      replyToSnapshot = {
        messageId: new Types.ObjectId(replyToMessageId),
        content: replyMsg.content,
        type: replyMsg.type,
        role: replyMsg.role as SenderRole,
      };
    }

    const messageDoc = await this._messageRepository.create({
      chatId: new Types.ObjectId(chatId),
      role,
      type,
      content,
      mediaUrl: mediaUrlKey,
      replyTo: replyToSnapshot,
      isDeleted: false,
    });
    await this._chatRepository.findByIdAndUpdate(chatId, {
      lastMessage: {
        messageId: messageDoc._id,
        type,
        role,
        content,
        isDeleted: false,
        createdAt: messageDoc.createdAt,
      },
    });

    return await ChatMessageResponseDTO.fromEntity(messageDoc, this._s3Service, role);
  }

  async markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<void> {
    await this._messageRepository.markRoomMessagesAsRead(chatId, role);
  }
  async deleteMessage(data: {
    participantId: string;
    role: SenderRole;
    chatId: string;
    messageId: string;
  }): Promise<void> {
    const { chatId, messageId, participantId, role } = data;
    const chat = await this._chatService.authorizeChat({
      chatId,
      participantId,
      role,
    });
    if (chat.isBlocked) {
      throw new CustomError(CHAT.MESSAGE_CANNOT_BE_SENT, HTTPSTATUS.FORBIDDEN);
    }
    const message = await this._messageRepository.findByIdAndUpdate(messageId, { isDeleted: true });
    if (!message) {
      throw new CustomError(CHAT.MESSAGE_NOT_FOUND);
    }
    if (chat.lastMessage?.messageId.toString() === message._id.toString()) {
      await this._chatRepository.findOneAndUpdate(
        {
          _id: new Types.ObjectId(chatId),
          "lastMessage.messageId": new Types.ObjectId(message._id),
        },
        { "lastMessage.isDeleted": true }
      );
    }
  }

  async editMessage(data: {
    messageId: string;
    chatId: string;
    role: SenderRole;
    content: string;
  }): Promise<void> {
    const { chatId, messageId, role, content } = data;
    const message = await this._messageRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(messageId),
        chatId: new Types.ObjectId(chatId),
        isDeleted: false,
        role,
        type: MESSAGE_TYPE.TEXT,
      },
      {
        content,
        isEdited: true,
      }
    );
    if (!message) {
      throw new CustomError(CHAT.MESSAGE_NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    await this._chatRepository.findOneAndUpdate(
      {
        _id: new Types.ObjectId(chatId),
        "lastMessage.messageId": new Types.ObjectId(messageId),
      },
      {
        "lastMessage.content": content,
      }
    );
  }

  async saveBookingEvent(input: {
    userId: string;
    workerId: string;
    bookingId: string;
    content: string;
  }): Promise<void> {
    const { userId, workerId, bookingId, content } = input;

    const chat = await this._chatRepository.findByParticipants(userId, workerId);
    if (!chat) return;

    await this._messageRepository.create({
      chatId: new Types.ObjectId(chat._id),
      role: ROLE.SYSTEM,
      type: MESSAGE_TYPE.BOOKING_EVENT,
      bookingId: new Types.ObjectId(bookingId),
      content,
    });
  }

  async notifyNewMessage(data: {
    chatId: string;
    participantIds: { userId: string; workerId: string };
    senderRole: SenderRole;
    senderName: string;
    savedMsg: ChatMessageResponseDTO;
  }): Promise<void> {
    const { chatId, participantIds, senderRole, senderName, savedMsg } = data;
    const io = getIO();

    io.to(chatId).emit("newMessage", savedMsg);
    io.to(participantIds.userId).emit("chatUpdated", {
      chatId,
      lastMessage: {
        messageId: savedMsg.id,
        type: savedMsg.type,
        role: savedMsg.role,
        content: savedMsg.content,
        createdAt: savedMsg.createdAt,
        isDeleted: savedMsg.isDeleted,
      },
    });
    io.to(participantIds.workerId).emit("chatUpdated", {
      chatId,
      lastMessage: {
        messageId: savedMsg.id,
        type: savedMsg.type,
        role: savedMsg.role,
        content: savedMsg.content,
        createdAt: savedMsg.createdAt,
        isDeleted: savedMsg.isDeleted,
      },
    });

    const recipientId =
      senderRole === ROLE.WORKER ? participantIds.userId : participantIds.workerId;

    io.to(recipientId).emit("new_notification", {
      heading: `New Message from ${senderName}`,
      message: this.getMessagePreview(savedMsg.type, savedMsg.content),
      chatId,
    });
  }

  private getMessagePreview(type: MessageType, content?: string): string {
    if (type === MESSAGE_TYPE.TEXT) {
      return content || "Sent a message";
    } else if (type === MESSAGE_TYPE.IMAGE) {
      return "Sent an image";
    } else if (type === MESSAGE_TYPE.VIDEO) {
      return "Sent a video";
    } else if (type === MESSAGE_TYPE.AUDIO) {
      return "Sent an audio";
    }
    return "Sent a message";
  }
}
