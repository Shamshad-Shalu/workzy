import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import WorkerDashboard from '@/features/worker/dashboard/pages/Dashboard';
import { WorkerLayout } from '@/layouts/worker/WorkerLayout';
import { ROLE } from '@/constants';
import WorkerProfileRouteWrapper from '@/features/worker/profile/wrappers/WorkerProfileWrapper';
import WorkerAboutContentPage from '@/features/worker/profile/pages/AboutContentPage ';
import WorkerServicesContentPage from '@/features/worker/profile/pages/ServicesContentPage';
import WorkerDocumentsContentPage from '@/features/worker/profile/pages/DocumentsContentPage';
import WorkerSubcriptionContentPage from '@/features/worker/profile/pages/SubscriptionContentPage';

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={[ROLE.WORKER]} />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />

          <Route path="profile/" element={<WorkerProfileRouteWrapper />}>
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
