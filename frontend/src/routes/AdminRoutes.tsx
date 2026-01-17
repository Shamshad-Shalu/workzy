import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = lazy(() => import('@/features/admin/dashboard/pages/Dashboard'));
const AdminLayout = lazy(() => import('@/layouts/admin/AdminLayout'));
const UserManagementPage = lazy(() => import('@/features/admin/user/pages/UserMangementPage'));
const WorkerManagementPage = lazy(
  () => import('@/features/admin/worker/pages/WorkerMangementPage')
);
const UserDetailsLayout = lazy(() => import('@/features/admin/user/pages/UserDetailsPage'));
const CategoryManagementPage = lazy(
  () => import('@/features/admin/service/pages/CategoryManagementPage')
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

            <Route path="categories" element={<CategoryManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
