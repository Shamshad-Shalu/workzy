import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import WorkerDashboard from '@/features/worker/dashboard/pages/Dashboard';
import { WorkerLayout } from '@/layouts/worker/WorkerLayout';

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
