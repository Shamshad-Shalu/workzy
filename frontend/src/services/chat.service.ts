import { CHAT_API } from '@/constants/apiRoutes/chat.routes';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { ChatListQuery, Chat, ChatResponse } from '@/types/chat';

const ChatService = {
  getChats: async (params: ChatListQuery): Promise<ChatResponse> => {
    const res = await api.get<ApiResponse<ChatResponse>>(CHAT_API.GET_CHATS, { params });
    return res.data.data;
  },
  getById: async (chatId: string): Promise<Chat> => {
    const res = await api.get<ApiResponse<Chat>>(CHAT_API.BY_ID(chatId));
    return res.data.data;
  },
  getOrCreateChat: async (participantId: string): Promise<Chat> => {
    const res = await api.post<ApiResponse<Chat>>(CHAT_API.CREATE, { participantId });
    return res.data.data;
  },
};

export default ChatService;
