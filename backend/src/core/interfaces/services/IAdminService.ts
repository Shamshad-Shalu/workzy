import { AdminDashboardAnalytics } from "@/types/admin.dashboard";

export interface IAdminService {
  getAdminDashboardAnalytics(): Promise<AdminDashboardAnalytics>;
}
