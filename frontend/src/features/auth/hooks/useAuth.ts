import { loginService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginService(email, password);

    dispatch(setCredentials({ user, accessToken }));
    return user;
  };

  return { login };
}
