export interface MonthlyEarningStat {
  month: string;
  income: number;
  jobs: number;
}

export interface WorkerDashboardAnalytics {
  totalAmount: number;
  totalEarnings: number;
  totalPlatformFee: number;
  earningsData: MonthlyEarningStat[];
}
