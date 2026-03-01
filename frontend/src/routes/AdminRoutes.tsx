import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import HomePageLayout from '@/features/admin/home/layout/HomeLayout';
import DummySubscriptionPage from '@/features/admin/subcription/pages/DummySubscriptionPage';

import ProtectedRoute from './ProtectedRoute';

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

const HomeSectionPage = lazy(() => import('@/features/admin/home/pages/HomeSectionPage'));
const HomeLayoutPage = lazy(() => import('@/features/admin/home/pages/HomeLayoutPage'));

const SubscriptionLayout = lazy(
  () => import('@/features/admin/subcription/pages/SubscriptionLayout')
);
const SubscriptionPage = lazy(() => import('@/features/admin/subcription/pages/SubscriptionPage'));
const PlanManagementPage = lazy(() => import('@/features/admin/subcription/pages/PlanManagement'));

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

            <Route path="transactions" element={<DummySubscriptionPage />} />

            <Route path="subscriptions" element={<SubscriptionLayout />}>
              <Route index element={<PlanManagementPage />} />
              <Route path="subscriptions" element={<SubscriptionPage />} />
            </Route>

            <Route path="home" element={<HomePageLayout />}>
              <Route index element={<HomeLayoutPage />} />
              <Route path="sections" element={<HomeSectionPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
