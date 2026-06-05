import { MessageType, SenderRole } from "@/constants";
import { ChatMessageResponseDTO } from "@/dtos/responses/chatMessage.dto";
import { MessageQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IMessageService {
  getMessages(input: MessageQuery): Promise<CursorPaginatedResult<ChatMessageResponseDTO>>;
  saveMessage(data: {
    chatId: string;
    senderId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
  }): Promise<ChatMessageResponseDTO>;
  markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<void>;
  deleteMessage(data: {
    participantId: string;
    role: SenderRole;
    chatId: string;
    messageId: string;
  }): Promise<void>;
}
