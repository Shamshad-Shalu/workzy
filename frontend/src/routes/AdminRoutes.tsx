import type React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '@/features/admin/dashboard/pages/Dashboard';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import UserManagementPage from '@/features/admin/user/pages/UserMangementPage';
import WorkerManagementPage from '@/features/admin/worker/pages/WorkerMangementPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="workers" element={<WorkerManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
