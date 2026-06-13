import { inject, injectable } from "inversify";

import logger from "@/config/logger";
import { CHAT, HTTPSTATUS, ROLE } from "@/constants";
import { MessageType, SenderRole } from "@/constants/chat";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { ISocketService } from "@/core/interfaces/services/ISocketService";
import { TYPES } from "@/di/types";
import { IChat } from "@/types/chat/chat.entity";
import CustomError from "@/utils/customError";

@injectable()
export class SocketService implements ISocketService {
  constructor(
    @inject(TYPES.ChatService) private _chatService: IChatService,
    @inject(TYPES.MessageService) private _messageService: IMessageService
  ) {}

  async handleJoinRoom(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ chatId: string }> {
    const { chatId, participantId, role } = data;

    const chat = await this._chatService.authorizeChat({
      chatId,
      participantId,
      role,
    });

    logger.info(`${participantId} joined room ${chat._id.toString()}`);
    return { chatId: chat._id.toString() };
  }

  async handleSendMessage(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
    replyToMessageId?: string;
  }): Promise<void> {
    const { chatId, participantId, role, type, content, mediaUrl, replyToMessageId } = data;

    const chat = await this._chatService.getChatRoomById({
      chatId,
      participantId,
      role,
    });
    if (chat.isBlocked && role !== ROLE.ADMIN) {
      throw new CustomError(CHAT.BLOCKED, HTTPSTATUS.FORBIDDEN);
    }

    const savedMsg = await this._messageService.saveMessage({
      chatId,
      senderId: participantId,
      role,
      type,
      content,
      mediaUrl,
      replyToMessageId,
    });

    const { user, worker } = chat.participants;
    const senderName = role === ROLE.WORKER ? worker.name : user.name;

    await this._messageService.notifyNewMessage({
      chatId,
      participantIds: { userId: user.id, workerId: worker.id },
      senderRole: role,
      senderName,
      savedMsg,
    });
  }

  async handleDeleteMessage(data: {
    messageId: string;
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ messageId: string; chatId: string }> {
    const { messageId, chatId, participantId, role } = data;

    await this._messageService.deleteMessage({
      messageId,
      chatId,
      participantId,
      role,
    });

    return { messageId, chatId };
  }

  async handleEditMessage(data: {
    messageId: string;
    chatId: string;
    participantId: string;
    role: SenderRole;
    content: string;
  }): Promise<{ messageId: string; chatId: string; content: string }> {
    const { messageId, chatId, participantId, role, content } = data;

    await this._chatService.authorizeChat({ chatId, participantId, role });
    await this._messageService.editMessage({ messageId, chatId, role, content });

    return { messageId, chatId, content };
  }

  async handleMarkMessagesAsRead(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ chatId: string; readerId: string }> {
    const { chatId, participantId, role } = data;

    await this._chatService.getChatRoomById({ chatId, participantId, role });
    await this._messageService.markRoomMessagesAsRead(chatId, role);

    return { chatId, readerId: participantId };
  }

  async handleToggleChatStatus(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<IChat> {
    const { chatId, participantId, role } = data;

    return await this._chatService.toggleChatStatus({ chatId, participantId, role });
  }
}
