import type { MessageType, Role } from '@/constants';

export interface ChatRoom {
  id: string;
  chatId: string;
  bookingId: string;
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
    type: MessageType;
    role: Role;
    content?: string;
    createdAt: Date;
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
