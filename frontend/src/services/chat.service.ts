import { CHAT_API } from '@/constants/apiRoutes/chat.routes';
import api from '@/lib/api/axios';
import type { ChatListQuery, Chat, ChatResponse } from '@/types/chat';

const ChatService = {
  getChats: async (params: ChatListQuery): Promise<ChatResponse> => {
    const res = await api.get(CHAT_API.GET_CHATS, { params });
    return res.data;
  },
  getById: async (chatId: string): Promise<Chat> => {
    const res = await api.get(CHAT_API.BY_ID(chatId));
    return res.data;
  },
  getOrCreateChat: async (participantId: string): Promise<Chat> => {
    const res = await api.post(CHAT_API.CREATE, { participantId });
    return res.data;
  },
};

export default ChatService;
