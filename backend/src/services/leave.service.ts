import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { HTTPSTATUS, LEAVE } from "@/constants";
import { ILeaveRepository } from "@/core/interfaces/repositories/ILeaveRepository";
import { ISlotRepository } from "@/core/interfaces/repositories/ISlotRepository";
import { ILeaveService } from "@/core/interfaces/services/ILeaveService";
import { TYPES } from "@/di/types";
import { CreateLeaveDTO } from "@/dtos/requests/leave.dto";
import { LeaveResponseDTO } from "@/dtos/responses/leave.dto";
import { GetLeavesQueryDTO, LeaveStatsResponseDTO } from "@/types/leave";
import CustomError from "@/utils/customError";
import { getTodayStart } from "@/utils/time.utils";

@injectable()
export class LeaveService implements ILeaveService {
  constructor(
    @inject(TYPES.LeaveRepository) private _leaveRepository: ILeaveRepository,
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository
  ) {}

  async createLeave(workerId: string, data: CreateLeaveDTO): Promise<LeaveResponseDTO> {
    const { startDate, endDate } = data;

    if (startDate > endDate) {
      throw new CustomError(LEAVE.INVALID_DATES, HTTPSTATUS.BAD_REQUEST);
    }
    if (startDate < getTodayStart()) {
      throw new CustomError(LEAVE.PAST_DATE, HTTPSTATUS.BAD_REQUEST);
    }
    const [overlapping, hasBookedSlots] = await Promise.all([
      this._leaveRepository.getActiveLeaves(workerId, startDate, endDate),
      this._slotRepository.hasBookedSlotsInRange(workerId, startDate, endDate),
    ]);
    if (overlapping.length > 0) {
      throw new CustomError(LEAVE.OVERLAP, HTTPSTATUS.CONFLICT);
    }
    if (hasBookedSlots) {
      throw new CustomError(LEAVE.SLOT_CONFLICT, HTTPSTATUS.CONFLICT);
    }
    const leave = await this._leaveRepository.create({
      workerId: new Types.ObjectId(workerId),
      ...data,
    });
    return LeaveResponseDTO.fromEntity(leave);
  }

  async cancelLeave(leaveId: string, workerId: string): Promise<void> {
    const result = await this._leaveRepository.deleteOne({
      _id: new Types.ObjectId(leaveId),
      workerId: new Types.ObjectId(workerId),
    });
    if (result.deletedCount === 0) {
      throw new CustomError(LEAVE.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
  }

  async getWorkerLeaves(
    filters: GetLeavesQueryDTO
  ): Promise<{ leaves: LeaveResponseDTO[]; nextCursor: string | null }> {
    const { data, nextCursor } = await this._leaveRepository.getPaginatedLeaves(filters);
    return {
      leaves: LeaveResponseDTO.fromEntities(data),
      nextCursor,
    };
  }

  async isWorkerOnLeave(workerId: string, date: Date): Promise<boolean> {
    const leaves = await this._leaveRepository.getActiveLeaves(workerId, date, date);
    return leaves.length > 0;
  }

  async getLeaveStats(workerId: string): Promise<LeaveStatsResponseDTO> {
    return await this._leaveRepository.getLeaveStats(workerId);
  }
}
