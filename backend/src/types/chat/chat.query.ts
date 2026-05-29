import { Cursor } from "../common/query";

export interface MessageQuery {
  bookingId: string;
  limit: number;
  cursor?: Cursor | null;
  isDeleted?: boolean;
}
