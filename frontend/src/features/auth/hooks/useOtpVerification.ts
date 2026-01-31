import { verifyOtpService } from '@/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export function useAuthOtp() {
  const dispatch = useAppDispatch();

  const verifyOtp = async (email: string, otp: string) => {
    const { user, accessToken } = await verifyOtpService(email, otp);

    dispatch(setCredentials({ user, accessToken }));
    return user;
  };

  return { verifyOtp };
}
