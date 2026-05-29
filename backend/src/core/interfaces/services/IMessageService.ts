import { ChatMessageResponseDTO } from "@/dtos/responses/chat.dto";
import { MessageQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IMessageService {
  getMessages(input: MessageQuery): Promise<CursorPaginatedResult<ChatMessageResponseDTO>>;
}
