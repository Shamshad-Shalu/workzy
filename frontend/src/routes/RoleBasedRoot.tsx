import { ROLE } from '@/constants';
import HomePage from '@/pages/Home';
import { useAppSelector } from '@/store/hooks';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoot() {
  const { user, isAuthenticated } = useAppSelector(s => s.auth);

  if (!isAuthenticated || !user) {
    return <HomePage />;
  }
  if (user.role === ROLE.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === ROLE.WORKER) {
    return <Navigate to="/worker/dashboard" replace />;
  }
  return <HomePage />;
}
