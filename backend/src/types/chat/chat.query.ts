import { SenderRole } from "@/constants";

import { Cursor } from "../common/query";

export interface MessageQuery {
  role: SenderRole;
  chatId: string;
  limit: number;
  cursor?: Cursor | null;
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
  isActive?: boolean;
}
