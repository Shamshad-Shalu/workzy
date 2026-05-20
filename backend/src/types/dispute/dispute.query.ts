import { DisputeReason, DisputeStatus } from "@/constants";

import { Cursor } from "../common/query";

export interface DisputeListQuery {
  search?: string;
  userId?: string;
  workerId?: string;
  status?: DisputeStatus | "all";
  reason?: DisputeReason | "all";
  cursor?: Cursor | null;
  limit: number;
}

export interface DisputeStatsQuery {
  userId?: string;
  workerId?: string;
}
