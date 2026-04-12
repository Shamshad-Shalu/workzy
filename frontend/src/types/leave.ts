export type LeaveFilter = 'all' | 'upcoming' | 'past' | 'this-month';

export interface Leave {
  id: string;
  workerId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  createdAt: string;
}

export interface LeaveStatsResponse {
  total: number;
  upcoming: number;
  past: number;
  thisMonth: number;
}

export interface GetLeavesResponse {
  leaves: Leave[];
  nextCursor: string | null;
}

export interface CreateLeavePayload {
  startDate: string;
  endDate: string;
  reason?: string;
}
