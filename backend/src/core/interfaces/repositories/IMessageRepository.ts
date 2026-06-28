import { SenderRole } from "@/constants";
import { UnreadCountResult } from "@/types/chat/chat.projection";
import { MessageQuery } from "@/types/chat/chat.query";
import { IChatMessage } from "@/types/chat/chatMessage.entity";
import { CursorPaginatedResult } from "@/types/common/pagination";

import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<IChatMessage> {
  getMessages(filter: MessageQuery): Promise<CursorPaginatedResult<IChatMessage>>;
  getUnreadCounts(chatIds: string[], role: SenderRole): Promise<UnreadCountResult[]>;
  markRoomMessagesAsDelivered(chatId: string, role: SenderRole): Promise<number>;
  markMessageAsDelivered(messageId: string, role: SenderRole): Promise<IChatMessage | null>;
  markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<number>;
}
