import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { ROLE } from '@/constants';
import HomePage from '@/pages/Home';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { syncUserLocation } from '@/utils/locationSync';

export default function RoleBasedRoot() {
  const { user, isAuthenticated, status } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      syncUserLocation(dispatch, user);
    }
  }, [dispatch, isAuthenticated, user]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <HomePage />;
  }

  if (user.role === ROLE.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === ROLE.WORKER) {
    return <Navigate to="/worker/dashboard" replace />;
  }

  return <HomePage />;
}
