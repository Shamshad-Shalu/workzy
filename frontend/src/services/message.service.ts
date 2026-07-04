import { MESSAGE_API } from '@/constants/apiRoutes/message.routes';
import api from '@/lib/api/axios';
import type { MessagesListQuery, MessagesResponse } from '@/types/chatMessage';

const MessageService = {
  getMessages: async (chatId: string, params: MessagesListQuery): Promise<MessagesResponse> => {
    const res = await api.get(MESSAGE_API.GET_MESSAGES(chatId), { params });
    return res.data;
  },
};

export default MessageService;
