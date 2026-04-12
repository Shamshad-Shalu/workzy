import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROLE } from '@/constants';
import WorkerBookingsPage from '@/features/worker/booking/pages/WorkerBookingsPage';
import WorkerLeaveManagement from '@/features/worker/profile/pages/WorkerLeaveManagement ';

import ProtectedRoute from './ProtectedRoute';

const WorkerLayout = lazy(() => import('@/layouts/worker/WorkerLayout'));
const WorkerDashboard = lazy(() => import('@/features/worker/dashboard/pages/Dashboard'));
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

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={[ROLE.WORKER]} />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="services" element={<WorkerServicesPage />} />
          <Route path="subscriptions" element={<SubscriptionPage />} />
          <Route path="booking" element={<WorkerBookingsPage />} />
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
