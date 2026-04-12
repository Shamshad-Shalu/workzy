import { CreateLeaveDTO } from "@/dtos/requests/leave.dto";
import { LeaveResponseDTO } from "@/dtos/responses/leave.dto";
import { GetLeavesQueryDTO, LeaveStatsResponseDTO } from "@/types/leave";

export interface ILeaveService {
  createLeave(workerId: string, data: CreateLeaveDTO): Promise<LeaveResponseDTO>;
  cancelLeave(leaveId: string, workerId: string): Promise<void>;
  getWorkerLeaves(
    filters: GetLeavesQueryDTO
  ): Promise<{ leaves: LeaveResponseDTO[]; nextCursor: string | null }>;
  isWorkerOnLeave(workerId: string, date: Date): Promise<boolean>;
  getLeaveStats(workerId: string): Promise<LeaveStatsResponseDTO>;
}
