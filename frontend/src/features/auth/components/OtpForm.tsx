import { useState, useEffect } from 'react';
import OtpInput from '@/components/atoms/OtpInput';
import Button from '@/components/atoms/Button';
import { resendOtpService } from '@/services/authService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthOtp } from '../hooks/useOtpVerification';
import { AUTH_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/handleApiError';

export default function OtpForm() {
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { verifyOtp } = useAuthOtp();
  const email = state?.email;

  useEffect(() => {
    if (timer === 0) {
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otpValue.length === 6) {
      submitOtp();
    }
  }, [otpValue]);

  const submitOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    try {
      await verifyOtp(email, otpValue);
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);

      await new Promise(r => setTimeout(r, 150));
      navigate('/');
    } catch (err: any) {
      toast.error(handleApiError(err));
    }
  };

  const resendOtp = async () => {
    if (timer !== 0 || isResending) {
      return;
    }

    setIsResending(true);
    setTimer(30);

    try {
      await resendOtpService(email);
      toast.success('OTP resent!');
    } catch (err) {
      toast.error('Failed to resend OTP');
      setTimer(0);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verify OTP</h1>
      <p className="text-gray-600">Enter the code sent to {email}</p>

      <OtpInput value={otpValue} onChange={setOtpValue} />

      <Button fullWidth onClick={submitOtp}>
        Verify OTP →
      </Button>

      {timer > 0 ? (
        <p className="text-gray-600 text-center">
          Resend OTP in <b>{timer}s</b>
        </p>
      ) : (
        <button
          type="button"
          onClick={resendOtp}
          className="text-black hover:underline mx-auto block"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}
