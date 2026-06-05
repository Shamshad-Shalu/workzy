import { CHAT_API } from '@/constants/apiRoutes/chat.routes';
import api from '@/lib/api/axios';
import type { ChatListQuery, ChatRoom, ChatRoomResponse } from '@/types/chat';

const ChatService = {
  getChatRooms: async (params: ChatListQuery): Promise<ChatRoomResponse> => {
    const res = await api.get(CHAT_API.GET_CHAT_ROOMS, { params });
    return res.data;
  },
  getRoomById: async (chatId: string): Promise<ChatRoom> => {
    const res = await api.get(CHAT_API.GET_ROOM_BY_ID(chatId));
    return res.data;
  },
  createChatRoom: async (bookingId: string): Promise<ChatRoom> => {
    const res = await api.post(CHAT_API.CREATE_ROOM, { bookingId });
    return res.data;
  },
};

export default ChatService;
