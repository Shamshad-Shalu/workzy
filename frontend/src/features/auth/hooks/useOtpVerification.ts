import { setCredentials } from '@/store/slices/authSlice';
import { verifyOtpService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';

export function useAuthOtp() {
  const dispatch = useAppDispatch();

  const verifyOtp = async (email: string, otp: string) => {
    const { user, accessToken } = await verifyOtpService(email, otp);

    dispatch(setCredentials({ user, accessToken }));
    return user;
  };

  return { verifyOtp };
}
