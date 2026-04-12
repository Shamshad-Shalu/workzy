import { FlattenMaps } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { GetLeavesQueryDTO, ILeave, LeaveStatsResponseDTO } from "@/types/leave";

export interface ILeaveRepository extends BaseRepository<ILeave> {
  getActiveLeaves(workerId: string, from: Date, to: Date): Promise<FlattenMaps<ILeave>[]>;
  getLeaveStats(workerId: string): Promise<LeaveStatsResponseDTO>;
  getPaginatedLeaves(
    filters: GetLeavesQueryDTO
  ): Promise<{ data: FlattenMaps<ILeave>[]; nextCursor: string | null }>;
}
