import { Cursor } from "../common/query";

export interface NotificationListQuery {
  recipientId: string;
  read?: boolean;
  limit: number;
  cursor?: Cursor | null;
}
