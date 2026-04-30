import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import HomePageLayout from '@/features/admin/home/layout/HomeLayout';

import ProtectedRoute from './ProtectedRoute';

const AdminDashboard = lazy(() => import('@/features/admin/dashboard/pages/Dashboard'));
const AdminLayout = lazy(() => import('@/layouts/admin/AdminLayout'));
const UserManagementPage = lazy(() => import('@/features/admin/user/pages/UserMangementPage'));
const UserDetailsLayout = lazy(() => import('@/features/admin/user/pages/UserDetailsLayout'));

const WorkerManagementPage = lazy(
  () => import('@/features/admin/worker/pages/WorkerMangementPage')
);
const WorkerDetailsLayout = lazy(() => import('@/features/admin/worker/pages/WorkerDetailsLayout'));
const CategoryManagementPage = lazy(
  () => import('@/features/admin/service/pages/CategoryManagementPage')
);

const HomeSectionPage = lazy(() => import('@/features/admin/home/pages/HomeSectionPage'));
const HomeLayoutPage = lazy(() => import('@/features/admin/home/pages/HomeLayoutPage'));

const SubscriptionLayout = lazy(
  () => import('@/features/admin/subcription/pages/SubscriptionLayout')
);
const AdminReviewsPage = lazy(() => import('@/features/admin/reviews/pages/AdminReviewsPage'));

const SubscriptionPage = lazy(() => import('@/features/admin/subcription/pages/SubscriptionPage'));
const PlanManagementPage = lazy(() => import('@/features/admin/subcription/pages/PlanManagement'));
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
            <Route path="users" element={<UserManagementPage />} />
            <Route path="users/:userId" element={<UserDetailsLayout />}></Route>

            <Route path="workers" element={<WorkerManagementPage />} />
            <Route path="workers/:workerId" element={<WorkerDetailsLayout />}></Route>

            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />

            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="bookings" element={<AdminBookingPage />} />
            <Route path="bookings/:bookingId" element={<AdminBookingDetailsPage />} />

            <Route path="subscriptions" element={<SubscriptionLayout />}>
              <Route index element={<PlanManagementPage />} />
              <Route path="subscriptions" element={<SubscriptionPage />} />
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
