import type { MessageType, Role } from '@/constants';

export interface Chat {
  id: string;
  chatId: string;
  participants: {
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
  isBlocked: boolean;
  blockedBy?: Role;
  unread?: number;
  lastMessage?: {
    messageId: string;
    type: MessageType;
    role: Role;
    content?: string;
    createdAt: Date;
    isDeleted: boolean;
  };
}

export interface ChatResponse {
  chats: Chat[];
  nextCursor: string | null;
}

export interface ChatListQuery {
  limit: number;
  cursor?: string | null;
  search?: string;
}
