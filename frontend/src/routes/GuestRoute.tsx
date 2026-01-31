import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

import type React from 'react';

const GuestRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector((s: RootState) => s.auth);

  if (isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
