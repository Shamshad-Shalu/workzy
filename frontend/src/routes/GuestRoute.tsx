import { useAppSelector } from '@/store/hooks';
import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector(s => s.auth);

  if (isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
