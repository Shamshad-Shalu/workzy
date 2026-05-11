export interface RevenueChartItem {
  month: string;
  revenue: number;
  commission: number;
}

export interface UserGrowthItem {
  month: string;
  users: number;
  workers: number;
}

export interface CategoryDistributionItem {
  name: string;
  value: number;
}

export interface TopWorkerItem {
  workerId: string;
  name: string;
  jobs: number;
  rating: number;
  earnings: number;
}

export interface PendingApprovalStats {
  workers: number;
  extraCharges: number;
}

export interface AdminDashboardAnalytics {
  totalUsers: number;
  totalWorkers: number;
  totalCategories: number;
  totalSubCategories: number;
  activeJobs: number;
  pendingWorkers: number;
  pendingExtraCharges: number;
  revenue: number;
  commission: number;
  revenueData: RevenueChartItem[];
  userGrowth: UserGrowthItem[];
  categoryDistribution: CategoryDistributionItem[];
  topWorkers: TopWorkerItem[];
  pendingApprovals: PendingApprovalStats;
}
