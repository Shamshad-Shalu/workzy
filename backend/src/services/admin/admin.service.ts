import { inject, injectable } from "inversify";

import { BOOKING_STATUS, WORKER_STATUS } from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { ICategoryRepository } from "@/core/interfaces/repositories/ICategoryRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IAdminService } from "@/core/interfaces/services/IAdminService";
import { TYPES } from "@/di/types";
import { AdminDashboardAnalytics, UserGrowthItem } from "@/types/admin.dashboard";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository
  ) {}

  async getAdminDashboardAnalytics(): Promise<AdminDashboardAnalytics> {
    const [
      totalUsers,
      totalWorkers,
      pendingWorkers,
      totalCategories,
      totalSubCategories,
      activeJobs,
      pendingExtraCharges,

      revenueData,
      categoryDistribution,
      topWorkers,

      userGrowthAnalytics,
      workerGrowthAnalytics,
    ] = await Promise.all([
      this._userRepository.countDocuments({}),

      this._workerRepository.countDocuments({}),

      this._workerRepository.countDocuments({
        status: WORKER_STATUS.PENDING,
      }),

      this._categoryRepository.countDocuments({
        level: 1,
        parentId: null,
      }),

      this._categoryRepository.countDocuments({
        level: 2,
      }),

      this._bookingRepository.countDocuments({
        status: {
          $nin: [
            BOOKING_STATUS.CANCELLED,
            BOOKING_STATUS.REJECTED,
            BOOKING_STATUS.DISPUTED,
            BOOKING_STATUS.EXPIRED,
          ],
        },
      }),

      this._bookingRepository.countDocuments({
        "extraCharge.status": "pending",
      }),

      this._bookingRepository.getRevenueAnalytics(),

      this._bookingRepository.getCategoryDistribution(),

      this._bookingRepository.getTopWorkers(),

      this._userRepository.getUserGrowthAnalytics(),

      this._workerRepository.getWorkerGrowthAnalytics(),
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const userGrowth: UserGrowthItem[] = months.map((month, index) => {
      const users = userGrowthAnalytics.find((item) => item.month === index + 1);

      const workers = workerGrowthAnalytics.find((item) => item.month === index + 1);

      return {
        month,
        users: users?.users ?? 0,
        workers: workers?.workers ?? 0,
      };
    });

    const revenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

    const commission = revenueData.reduce((sum, item) => sum + item.commission, 0);

    return {
      totalUsers,
      totalWorkers,

      totalCategories,
      totalSubCategories,

      activeJobs,

      pendingWorkers,
      pendingExtraCharges,

      revenue,
      commission,

      revenueData,

      userGrowth,

      categoryDistribution,

      topWorkers,

      pendingApprovals: {
        workers: pendingWorkers,
        extraCharges: pendingExtraCharges,
      },
    };
  }
}
