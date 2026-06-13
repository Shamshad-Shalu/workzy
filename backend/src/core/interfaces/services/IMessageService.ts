import { MessageType, SenderRole } from "@/constants";
import { ChatMessageResponseDTO } from "@/dtos/responses/chatMessage.dto";
import { MessageQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IMessageService {
  getMessages(input: MessageQuery): Promise<CursorPaginatedResult<ChatMessageResponseDTO>>;
  getMessageContext(input: {
    chatId: string;
    messageId: string;
    limit: number;
    role: SenderRole;
  }): Promise<{ data: ChatMessageResponseDTO[]; nextCursor: string | null }>;
  saveMessage(data: {
    chatId: string;
    senderId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
    replyToMessageId?: string;
  }): Promise<ChatMessageResponseDTO>;
  markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<void>;
  deleteMessage(data: {
    participantId: string;
    role: SenderRole;
    chatId: string;
    messageId: string;
  }): Promise<void>;
  editMessage(data: {
    messageId: string;
    chatId: string;
    role: SenderRole;
    content: string;
  }): Promise<void>;
  saveBookingEvent(input: {
    userId: string;
    workerId: string;
    bookingId: string;
    content: string;
  }): Promise<void>;
  notifyNewMessage(data: {
    chatId: string;
    participantIds: { userId: string; workerId: string };
    senderRole: SenderRole;
    senderName: string;
    savedMsg: ChatMessageResponseDTO;
  }): Promise<void>;
}
