import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import WorkerDashboard from '@/features/worker/dashboard/pages/Dashboard';
import { WorkerLayout } from '@/layouts/worker/WorkerLayout';

export default function WorkerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Wrap ALL worker pages in WorkerLayout */}
        <Route element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />

          {/* Add future worker pages here */}
          {/* <Route path="jobs" element={<WorkerJobs />} /> */}
          {/* <Route path="wallet" element={<WorkerWallet />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}
