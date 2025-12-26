import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { refreshAccessToken } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { AUTH_MESSAGES } from '@/constants';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'blocked') {
      navigate('/login', { state: { blocked: true } });
      return;
    }
    dispatch(refreshAccessToken())
      .unwrap()
      .then(data => {
        const role = data.user.role;

        if (role === 'worker') {
          navigate('/worker/dashboard', { replace: true });
        } else if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        toast.error(AUTH_MESSAGES.AUTH_FAILED);
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        <p className="mt-4 text-muted-foreground">Completing Google sign in...</p>
      </div>
    </div>
  );
}
