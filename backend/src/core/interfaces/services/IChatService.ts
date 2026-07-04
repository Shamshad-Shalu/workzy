import { SenderRole } from "@/constants";
import { ChatResponseDTO } from "@/dtos/responses/chat.dto";
import { IChat } from "@/types/chat/chat.entity";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IChatService {
  getChatRooms(input: ChatQuery): Promise<CursorPaginatedResult<ChatResponseDTO>>;
  getOrCreateChat(data: {
    creatorId: string;
    creatorRole: SenderRole;
    participantId: string;
  }): Promise<ChatResponseDTO>;
  getChatRoomById(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<ChatResponseDTO>;
  authorizeChat(data: { chatId: string; participantId: string; role: SenderRole }): Promise<IChat>;
  toggleChatStatus(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<IChat>;
}
