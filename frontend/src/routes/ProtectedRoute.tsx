import { useAppSelector } from '@/store/hooks';
import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  requiredRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, accessToken, status } = useAppSelector(s => s.auth);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-9 w-9 border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  if (!accessToken || !user) {
    return <Navigate to={'/'} replace />;
  }

  if (requiredRoles && (!user.role || !requiredRoles.includes(user.role))) {
    return <Navigate to={'/unauthorized'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
