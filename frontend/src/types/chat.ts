import type { MessageType, Role } from '@/constants';

export interface ChatRoom {
  id: string;
  chatId: string;
  bookingId: string;
  bookingMongoId: string;

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
  isActive: boolean;
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

export interface ChatRoomResponse {
  chats: ChatRoom[];
  nextCursor: string | null;
}

export interface ChatListQuery {
  limit: number;
  cursor?: string | null;
  search?: string;
  isActive?: string;
}
