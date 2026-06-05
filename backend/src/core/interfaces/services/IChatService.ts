import { SenderRole } from "@/constants";
import { ChatResponseDTO } from "@/dtos/responses/chat.dto";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IChatService {
  getChatRooms(input: ChatQuery): Promise<CursorPaginatedResult<ChatResponseDTO>>;
  createChatRoom(bookingId: string, creatorId: string, role: SenderRole): Promise<ChatResponseDTO>;
  getChatRoomById(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<ChatResponseDTO>;
  disableChatRoom(chatId: string): Promise<void>;
}
