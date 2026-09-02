import { MESSAGE_API } from '@/constants/apiRoutes/message.routes';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type { MessagesListQuery, MessagesResponse } from '@/types/chatMessage';

const MessageService = {
  getMessages: async (chatId: string, params: MessagesListQuery): Promise<MessagesResponse> => {
    const res = await api.get<ApiResponse<MessagesResponse>>(MESSAGE_API.GET_MESSAGES(chatId), {
      params,
    });
    return res.data.data;
  },
};

export default MessageService;
