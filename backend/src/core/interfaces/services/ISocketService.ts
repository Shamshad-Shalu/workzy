import { MessageType, SenderRole } from "@/constants/chat";
import { IChat } from "@/types/chat/chat.entity";

export interface ISocketService {
  handleJoinRoom(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ chatId: string }>;

  handleSendMessage(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
    type: MessageType;
    content?: string;
    mediaUrl?: string;
    replyToMessageId?: string;
  }): Promise<void>;

  handleDeleteMessage(data: {
    messageId: string;
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ messageId: string; chatId: string }>;

  handleMarkMessagesAsRead(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<{ chatId: string; readerId: string }>;

  handleEditMessage(data: {
    messageId: string;
    chatId: string;
    participantId: string;
    role: SenderRole;
    content: string;
  }): Promise<{ messageId: string; chatId: string; content: string }>;

  handleToggleChatStatus(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<IChat>;
}
