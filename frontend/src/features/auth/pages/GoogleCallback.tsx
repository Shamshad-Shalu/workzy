import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import type { User } from '@/types/user';
import { redirectBasedOnRole } from '@/utils/redirectBasedOnRole';
import { AUTH_MESSAGES } from '@/constants';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGoogleAuth = () => {
      const error = searchParams.get('error');
      const data = searchParams.get('data');

      if (error === 'blocked') {
        navigate('/login', { state: { blocked: true } });
        return;
      }
      if (data) {
        try {
          const decoded = JSON.parse(atob(data));
          const { user, accessToken } = decoded as { user: User; accessToken: string };
          dispatch(setCredentials({ user, accessToken }));

          redirectBasedOnRole(user.role, navigate);
        } catch (err) {
          toast.error(AUTH_MESSAGES.AUTH_FAILED);
          navigate('/login');
        }
      } else {
        toast.error(AUTH_MESSAGES.AUTH_NOT_RECIEVED);
        navigate('/login');
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
}
