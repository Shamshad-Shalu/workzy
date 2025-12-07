import type React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '@/features/admin/dashboard/pages/Dashboard';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import UserManagementPage from '@/features/admin/user/pages/UserMangementPage';
import WorkerManagementPage from '@/features/admin/worker/pages/WorkerMangementPage';
import UserDetailsLayout from '@/features/admin/user/pages/UserDetailsPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="users/:userId" element={<UserDetailsLayout />}></Route>

          <Route path="workers" element={<WorkerManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
