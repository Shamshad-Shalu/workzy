import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROLE } from '@/constants';
import WorkerPaymentsPage from '@/features/worker/payments/pages/WorkerPaymentsPage';

import ProtectedRoute from './ProtectedRoute';

const WorkerLayout = lazy(() => import('@/layouts/worker/WorkerLayout'));
const WorkerDashboard = lazy(() => import('@/features/worker/dashboard/pages/Dashboard'));
const WorkerReviews = lazy(() => import('@/features/worker/reviews/pages/WorkerReviewsPage'));
const WorkerServicesPage = lazy(
  () => import('@/features/worker/services/pages/WorkerServicesPage')
);
const WorkerProfileRouteWrapper = lazy(
  () => import('@/features/worker/profile/wrappers/WorkerProfileWrapper')
);
const WorkerAboutContentPage = lazy(
  () => import('@/features/worker/profile/pages/AboutContentPage')
);
const WorkerDocumentsContentPage = lazy(
  () => import('@/features/worker/profile/pages/DocumentsContentPage')
);
const AccountPage = lazy(() => import('@/features/worker/profile/pages/AccountPage'));
const SubscriptionPage = lazy(
  () => import('@/features/worker/subscription/pages/SubscriptionPage')
);
const WorkerBookingDetailsPage = lazy(
  () => import('@/features/worker/booking/pages/WorkerBookingDetailsPage')
);
const WorkerBookingsPage = lazy(() => import('@/features/worker/booking/pages/WorkerBookingsPage'));
const WorkerLeaveManagement = lazy(
  () => import('@/features/worker/profile/pages/WorkerLeaveManagement')
);

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={[ROLE.WORKER]} />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="reviews" element={<WorkerReviews />} />
          <Route path="services" element={<WorkerServicesPage />} />
          <Route path="subscriptions" element={<SubscriptionPage />} />
          <Route path="payments" element={<WorkerPaymentsPage />} />
          <Route path="bookings" element={<WorkerBookingsPage />} />
          <Route path="bookings/:bookingId" element={<WorkerBookingDetailsPage />} />
          <Route path="profile" element={<WorkerProfileRouteWrapper />}>
            <Route index element={<WorkerAboutContentPage />} />
            <Route path="documents" element={<WorkerDocumentsContentPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="leaves" element={<WorkerLeaveManagement />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
