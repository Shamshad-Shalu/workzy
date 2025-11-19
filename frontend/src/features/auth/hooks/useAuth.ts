import { setCredentials } from '@/store/slices/authSlice';
import { loginService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';

export function useAuth() {
  const dispatch = useAppDispatch();
  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginService(email, password);

    dispatch(setCredentials({ user, accessToken }));
    return user;
  };

  return { login };
}
