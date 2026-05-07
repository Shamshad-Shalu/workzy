import { QuoteStatus } from "@/constants";

import { Cursor } from "../common/query";

export interface QuoteListQuery {
  search?: string;
  userId?: string;
  workerId?: string;
  status?: QuoteStatus | "all";
  cursor?: Cursor | null;
  limit: number;
}
