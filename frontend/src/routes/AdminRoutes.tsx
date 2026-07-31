import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import AdminChatPage from '@/features/admin/chat/pages/AdminChatPage';
import AdminDisputesPage from '@/features/admin/disputes/pages/AdminDisputesPage';
import HomePageLayout from '@/features/admin/home/layout/HomeLayout';
import WorkerOverviewPage from '@/features/admin/worker/pages/WorkerOverviewPage';

import ProtectedRoute from './ProtectedRoute';

const AdminDashboard = lazy(() => import('@/features/admin/dashboard/pages/AdminDashboard'));
const AdminLayout = lazy(() => import('@/layouts/admin/AdminLayout'));
const UserManagementPage = lazy(() => import('@/features/admin/user/pages/UserMangementPage'));
const UserDetailsLayout = lazy(() => import('@/features/admin/user/pages/UserDetailsLayout'));

const WorkerManagementPage = lazy(
  () => import('@/features/admin/worker/pages/WorkerMangementPage')
);
const WorkerDetailsLayout = lazy(
  () => import('@/features/admin/worker/wrapper/WorkerDetailsLayout')
);
const CategoryManagementPage = lazy(
  () => import('@/features/admin/service/pages/CategoryManagementPage')
);

const HomeSectionPage = lazy(() => import('@/features/admin/home/pages/HomeSectionPage'));
const HomeLayoutPage = lazy(() => import('@/features/admin/home/pages/HomeLayoutPage'));
const AdminReviewsPage = lazy(() => import('@/features/review/pages/AdminReviewsPage'));
const AdminBookingPage = lazy(() => import('@/features/admin/booking/pages/AdminBookingPage'));
const AdminPaymentsPage = lazy(() => import('@/features/payments/pages/AdminPaymentsPage'));
const AdminBookingDetailsPage = lazy(
  () => import('@/features/admin/booking/pages/AdminBookingDetailsPage')
);

export default function AdminRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users">
              <Route index element={<UserManagementPage />} />
              <Route path=":userId" element={<UserDetailsLayout />} />
            </Route>

            <Route path="workers">
              <Route index element={<WorkerManagementPage />} />
              <Route path=":workerId" element={<WorkerDetailsLayout />}>
                <Route index element={<WorkerOverviewPage />} />
                <Route path="documents" element={<WorkerOverviewPage />} />
                <Route path="services" element={<WorkerOverviewPage />} />
                <Route path="bookings" element={<WorkerOverviewPage />} />
                <Route path="reviews" element={<WorkerOverviewPage />} />
                <Route path="quotes" element={<WorkerOverviewPage />} />
                <Route path="disputes" element={<WorkerOverviewPage />} />
                <Route path="payments" element={<WorkerOverviewPage />} />
              </Route>
            </Route>

            <Route path="bookings" element={<AdminBookingPage />} />
            <Route path="bookings/:bookingId" element={<AdminBookingDetailsPage />} />

            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="disputes" element={<AdminDisputesPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />

            <Route path="messages">
              <Route index element={<AdminChatPage />} />
              <Route path=":chatId" element={<AdminChatPage />} />
            </Route>

            <Route path="home" element={<HomePageLayout />}>
              <Route index element={<HomeLayoutPage />} />
              <Route path="sections" element={<HomeSectionPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
