import { ROLE } from '@/constants';
import HomePage from '@/pages/Home';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { Navigate, useLocation } from 'react-router-dom';

export default function RoleBasedRoot() {
  const { user, isAuthenticated, status } = useAppSelector((s: RootState) => s.auth);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const asUser = params.get('as') === 'user';

  if (status !== 'succeeded') {
    return null;
  }

  const isGuest = !isAuthenticated || !user;
  const workerUserMode = asUser && user?.role === ROLE.WORKER;

  if (isGuest || workerUserMode) {
    return <HomePage />;
  }

  if (user.role === ROLE.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === ROLE.WORKER) {
    return <Navigate to="/worker/dashboard" replace />;
  }
  return <HomePage />;
}
