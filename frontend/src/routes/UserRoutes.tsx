import Login from '@/features/auth/pages/Login';
import { Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import Signup from '@/features/auth/pages/Signup';
import OtpPage from '@/features/auth/pages/OtpPage';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import GoogleCallback from '@/features/auth/pages/GoogleCallback';
import RoleBasedRoot from './RoleBasedRoot';
import ProfilePage from '@/features/user/page/ProfilePage';

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleBasedRoot />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Route>

      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
