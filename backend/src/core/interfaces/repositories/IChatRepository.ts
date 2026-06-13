import { IChat } from "@/types/chat/chat.entity";
import { ChatListItem } from "@/types/chat/chat.projection";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

import { IBaseRepository } from "./IBaseRepository";

export interface IChatRepository extends IBaseRepository<IChat> {
  findByChatId(chatId: string): Promise<ChatListItem | null>;
  findByParticipants(userId: string, workerId: string): Promise<ChatListItem | null>;
  getChatRooms(filter: ChatQuery): Promise<CursorPaginatedResult<ChatListItem>>;
}
