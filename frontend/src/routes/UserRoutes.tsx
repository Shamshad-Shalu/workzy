import Login from '@/features/auth/pages/Login';
import HomePage from '@/pages/Home';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import Signup from '@/features/auth/pages/Signup';
import OtpPage from '@/features/auth/pages/OtpPage';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import GoogleCallback from '@/features/auth/pages/GoogleCallback';

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
