import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import WorkerDashboard from '@/features/worker/dashboard/pages/Dashboard';
import { WorkerLayout } from '@/layouts/worker/WorkerLayout';
import { ROLE } from '@/constants';
import WorkerProfilePage from '@/features/worker/profile/pages/WorkerProfilePage';
import DummyWorkerProfilePage from '@/features/worker/profile/pages/DummyWorkerProfilePage';

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRoles={[ROLE.WORKER]} />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="profile" element={<WorkerProfilePage />} />
          <Route path="wallet" element={<DummyWorkerProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
