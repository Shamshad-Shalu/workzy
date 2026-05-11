import { BaseRepository } from "@/core/abstracts/base.repository";
import { CategoryDistributionItem, RevenueChartItem, TopWorkerItem } from "@/types/admin.dashboard";
import { IBooking } from "@/types/booking/booking.entity";
import { BookingDetails, BookingListItem } from "@/types/booking/booking.projection";
import { BookingListQuery } from "@/types/booking/booking.query";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { WorkerDashboardAnalytics } from "@/types/worker/workerDashboard.types";

export interface IBookingRepository extends BaseRepository<IBooking> {
  getBookings(input: BookingListQuery): Promise<CursorPaginatedResult<BookingListItem>>;
  getExpiredBookings(): Promise<IBooking[]>;
  getBookingDetailById(bookingId: string): Promise<BookingDetails | null>;
  getWorkerDashboardAnalytics(workerId: string): Promise<WorkerDashboardAnalytics>;

  getRevenueAnalytics(): Promise<RevenueChartItem[]>;
  getCategoryDistribution(): Promise<CategoryDistributionItem[]>;
  getTopWorkers(): Promise<TopWorkerItem[]>;
}
