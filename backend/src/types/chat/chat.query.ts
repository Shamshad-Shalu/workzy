import { SenderRole } from "@/constants";

import { Cursor } from "../common/query";

export type MessagePaginationDirection = "older" | "newer" | "around";

export interface MessageQuery {
  role: SenderRole;
  search?: string;
  chatId: string;
  limit: number;
  cursor?: Cursor | null;
  messageId?: string;
  direction?: MessagePaginationDirection;
}

interface ChatCursor {
  updatedAt: Date;
  _id: string;
}

export interface ChatQuery {
  workerId?: string;
  userId?: string;
  search?: string;
  role: SenderRole;
  limit: number;
  cursor?: ChatCursor | null;
}
