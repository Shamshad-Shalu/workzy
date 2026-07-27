import { Role } from "@/constants";
import { CreateDisputeDto, ResolveDisputeDto } from "@/dtos/requests/dispute.dto";
import {
  DisputeListItemDto,
  DisputeResponseDto,
  DisputeStatsResponse,
} from "@/dtos/responses/dispute.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { DisputeListQuery, DisputeStatsQuery } from "@/types/dispute/dispute.query";

export interface IDisputeService {
  raiseDispute(
    bookingId: string,
    initiatorId: string,
    raisedBy: Role,
    data: CreateDisputeDto
  ): Promise<DisputeResponseDto>;
  updateDispute(
    disputeId: string,
    initiatorId: string,
    raisedBy: Role,
    data: CreateDisputeDto
  ): Promise<DisputeResponseDto>;
  getDisputeByBookingId(bookingId: string): Promise<DisputeResponseDto | null>;
  getAllDisputes(input: DisputeListQuery): Promise<CursorPaginatedResult<DisputeListItemDto>>;
  getDisputeStats(input?: DisputeStatsQuery): Promise<DisputeStatsResponse>;
  resolveDispute(disputeId: string, adminId: string, data: ResolveDisputeDto): Promise<void>;
}
