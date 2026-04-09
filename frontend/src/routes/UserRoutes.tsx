import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import { ROLE } from '@/constants';
import NotFound from '@/pages/NotFound';

import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

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

const ServicePage = lazy(() => import('@/features/user/services/pages/ServicePage'));
const WorkerListingPage = lazy(() => import('@/features/user/services/pages/WorkerListingPage'));

const WorkerProfileRouteLayout = lazy(
  () => import('@/features/user/worker/WorkerProfileRouteLayout')
);
const WorkerProfilePage = lazy(() => import('@/features/user/worker/pages/WorkerProfilePage'));
const WorkerServicesPage = lazy(() => import('@/features/user/worker/pages/WorkerServicesPage'));
const WorkerReviewsPage = lazy(() => import('@/features/user/worker/pages/WorkerReviewsPage'));

const UserBookingsPage = lazy(() => import('@/features/user/booking/pages/UserBookingsPage'));

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
          <Route path="/services" element={<ServicePage />} />
          <Route path="/services/:serviceId" element={<WorkerListingPage />} />
          <Route path="/join-us" element={<JoinUsPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />

          <Route path="/workers/:workerId" element={<WorkerProfileRouteLayout />}>
            <Route index element={<WorkerProfilePage />} />
            <Route path="services" element={<WorkerServicesPage />} />
            <Route path="reviews" element={<WorkerReviewsPage />} />
          </Route>
          <Route element={<ProtectedRoute requiredRoles={[ROLE.USER, ROLE.WORKER]} />}>
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
