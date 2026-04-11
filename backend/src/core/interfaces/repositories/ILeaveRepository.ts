import { FlattenMaps } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ILeave } from "@/types/leave";

export interface ILeaveRepository extends BaseRepository<ILeave> {
  getActiveLeaves(workerId: string, from: Date, to: Date): Promise<FlattenMaps<ILeave>[]>;
}
