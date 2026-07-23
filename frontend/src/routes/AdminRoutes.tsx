import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import AdminChatPage from '@/features/admin/chat/pages/AdminChatPage';
import AdminDisputesPage from '@/features/admin/disputes/pages/AdminDisputesPage';
import HomePageLayout from '@/features/admin/home/layout/HomeLayout';
import WorkerAboutPage from '@/features/admin/worker/pages/WorkerAboutPage';
import WorkerDocumentsPage from '@/features/admin/worker/pages/WorkerDocumentsPage';

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
const AdminReviewsPage = lazy(() => import('@/features/admin/reviews/pages/AdminReviewsPage'));
const AdminBookingPage = lazy(() => import('@/features/admin/booking/pages/AdminBookingPage'));
const AdminPaymentsPage = lazy(() => import('@/features/admin/payments/pages/AdminPaymentsPage'));
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
                <Route index element={<WorkerAboutPage />} />
                <Route path="documents" element={<WorkerDocumentsPage />} />
                <Route path="services" element={<WorkerAboutPage />} />
                <Route path="bookings" element={<WorkerAboutPage />} />
                <Route path="reviews" element={<WorkerAboutPage />} />
                <Route path="quotes" element={<WorkerAboutPage />} />
                <Route path="disputes" element={<WorkerAboutPage />} />
                <Route path="payments" element={<WorkerAboutPage />} />
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
