import type { MessageType, Role } from '@/constants';

export interface ChatMessage {
  id: string;
  chatId: string;
  type: MessageType;
  role: Role;
  content?: string;
  mediaUrl?: string;
  replyTo?: {
    messageId: string;
    content?: string;
    type: MessageType;
    role: Role;
  };
  isEdited: boolean;

  bookingId?: string;
  readByRoles: Role[];
  isDeleted: boolean;
  createdAt: Date;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
}

export interface MessagesListQuery {
  limit: number;
  cursor?: string | null;
  search?: string;
}
