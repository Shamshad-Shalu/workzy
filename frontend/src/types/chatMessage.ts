import type { MessageType, Role } from '@/constants';

type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read';

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
  status: MessageStatus;
  readByRoles: Role[];
  isDeleted: boolean;
  createdAt: Date;
  tempId?: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
  prevCursor: string | null;
}

export interface MessagesListQuery {
  limit: number;
  cursor?: string | null;
  search?: string;
  direction?: 'older' | 'newer' | 'around';
  messageId?: string;
}

export type MessagePageParam = Pick<MessagesListQuery, 'cursor' | 'direction' | 'messageId'>;
