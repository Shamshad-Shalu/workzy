import { DisputeStatsResponse } from "@/dtos/responses/dispute.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IDispute } from "@/types/dispute/dispute.entity";
import { DisputeDetails, DisputeListItem } from "@/types/dispute/dispute.projection";
import { DisputeListQuery, DisputeStatsQuery } from "@/types/dispute/dispute.query";

import { IBaseRepository } from "./IBaseRepository";

export interface IDisputeRepository extends IBaseRepository<IDispute> {
  findByBookingId(bookingId: string): Promise<DisputeDetails | null>;
  getAllDisputes(input: DisputeListQuery): Promise<CursorPaginatedResult<DisputeListItem>>;
  getDisputeStats(input?: DisputeStatsQuery): Promise<DisputeStatsResponse>;
}
