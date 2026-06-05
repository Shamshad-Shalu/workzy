import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { BOOKING, CHAT, HTTPSTATUS, ROLE } from "@/constants";
import { MessageType, SenderRole } from "@/constants/chat";
import { IChatRepository } from "@/core/interfaces/repositories/IChatRepository";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { ChatMessageResponseDTO } from "@/dtos/responses/chatMessage.dto";
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

  async saveMessage(data: {
    chatId: string;
    senderId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
  }): Promise<ChatMessageResponseDTO> {
    const { chatId, senderId, role, type, content, mediaUrl } = data;
    const chat = await this._chatService.getChatRoomById({ chatId, participantId: senderId, role });
    if (!chat.isActive) {
      throw new CustomError(CHAT.MESSAGE_CANNOT_BE_SENT, HTTPSTATUS.FORBIDDEN);
    }
    if (!Types.ObjectId.isValid(chatId)) {
      throw new CustomError(BOOKING.INVALID_BOOKING_ID);
    }
    const mediaUrlKey = mediaUrl ? extractKeyFromUrl(mediaUrl) : undefined;
    const messageDoc = await this._messageRepository.create({
      chatId: new Types.ObjectId(chatId),
      role,
      type,
      content,
      mediaUrl: mediaUrlKey,
      isDeleted: false,
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
    const { chatId, role, messageId, participantId } = data;
    const chat = await this._chatRepository.findById(chatId);
    if (!chat) {
      throw new CustomError(CHAT.NOT_FOUND);
    }
    if (
      !chat.isActive ||
      (role === ROLE.WORKER && chat.workerId.toString() !== participantId) ||
      (role === ROLE.USER && chat.userId.toString() !== participantId)
    ) {
      throw new CustomError(CHAT.UNAUTHORIZED);
    }
    const message = await this._messageRepository.findByIdAndUpdate(messageId, { isDeleted: true });
    if (!message) {
      throw new CustomError(CHAT.MESSAGE_NOT_FOUND);
    }
  }
}
