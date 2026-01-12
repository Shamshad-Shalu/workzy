import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLE } from '@/constants';

const WorkerLayout = lazy(() => import('@/layouts/worker/WorkerLayout'));
const WorkerDashboard = lazy(() => import('@/features/worker/dashboard/pages/Dashboard'));
const WorkerProfileRouteWrapper = lazy(
  () => import('@/features/worker/profile/wrappers/WorkerProfileWrapper')
);
const WorkerAboutContentPage = lazy(
  () => import('@/features/worker/profile/pages/AboutContentPage')
);
const WorkerServicesContentPage = lazy(
  () => import('@/features/worker/profile/pages/ServicesContentPage')
);
const WorkerDocumentsContentPage = lazy(
  () => import('@/features/worker/profile/pages/DocumentsContentPage')
);
const WorkerSubcriptionContentPage = lazy(
  () => import('@/features/worker/profile/pages/SubscriptionContentPage')
);

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={[ROLE.WORKER]} />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />

          <Route path="profile" element={<WorkerProfileRouteWrapper />}>
            <Route index element={<WorkerAboutContentPage />} />
            <Route path="about" element={<WorkerAboutContentPage />} />
            <Route path="services" element={<WorkerServicesContentPage />} />
            <Route path="documents" element={<WorkerDocumentsContentPage />} />
            <Route path="subscription" element={<WorkerSubcriptionContentPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
