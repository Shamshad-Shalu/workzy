import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROLE } from '@/constants';
import { Skeleton } from '@/components/ui/skeleton';

import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import ServicesPage from '@/features/user/services/pages/ServicePage';

// guest pages
const Login = lazy(() => import('@/features/auth/pages/Login'));
const Signup = lazy(() => import('@/features/auth/pages/Signup'));
const OtpPage = lazy(() => import('@/features/auth/pages/OtpPage'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const GoogleCallback = lazy(() => import('@/features/auth/pages/GoogleCallback'));

const UserProfilePage = lazy(() => import('@/features/user/profile/pages/UserProfilePage'));
const RoleBasedRoot = lazy(() => import('./RoleBasedRoot'));
const JoinUsPage = lazy(() => import('@/pages/JoinUsPage'));
const UserLayout = lazy(() => import('@/layouts/user/UserLayout'));

export default function UserRoutes() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
        </Route>

        <Route element={<UserLayout />}>
          <Route path="/" element={<RoleBasedRoot />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/join-us" element={<JoinUsPage />} />
          <Route element={<ProtectedRoute requiredRoles={[ROLE.USER, ROLE.WORKER]} />}>
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
