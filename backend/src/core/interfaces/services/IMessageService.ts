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
    replyToMessageId?: string;
  }): Promise<ChatMessageResponseDTO>;
  markRoomMessagesAsDelivered(chatId: string, role: SenderRole): Promise<number>;
  markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<number>;
  markMessageAsDelivered(
    messageId: string,
    role: SenderRole
  ): Promise<ChatMessageResponseDTO | null>;
  deleteMessage(data: { messageId: string; chatId: string; lastMessageId?: string }): Promise<void>;
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
    savedMsg: ChatMessageResponseDTO;
    tempId?: string;
  }): Promise<void>;
}
