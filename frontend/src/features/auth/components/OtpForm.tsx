import { useState } from 'react';
import OtpInput from '@/components/atoms/OtpInput';
import Button from '@/components/atoms/Button';
import { resendOtpService } from '@/services/authService';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthOtp } from '../hooks/useOtpVerification';
import { AUTH_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/handleApiError';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '@/components/molecules/PageHeader';
import { useOtpTimer } from '../hooks/useOtpTimer';
import { ArrowRight } from 'lucide-react';

export default function OtpForm() {
  const [otpValue, setOtpValue] = useState<string>('');
  const { timer, resetTimer } = useOtpTimer(30);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { verifyOtp } = useAuthOtp();
  const { login } = useAuth();

  const email = state?.email;
  const password = state?.password;

  const submitOtp = async (code: string = otpValue) => {
    if (code.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    try {
      await verifyOtp(email, code);
      if (email && password) {
        await login(email, password);
      }
      toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);
      navigate('/');
    } catch (err: any) {
      toast.error(handleApiError(err));
    }
  };

  const resendOtp = async () => {
    if (timer !== 0) {
      return;
    }
    resetTimer();
    try {
      await resendOtpService(email);
      toast.success(AUTH_MESSAGES.OTP_RESET_SUCCESS);
    } catch (err) {
      toast.error(AUTH_MESSAGES.FAILED_OTP_SEND);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Verify OTP" description={`Enter the code sent to ${email}`} />
      <OtpInput
        value={otpValue}
        onChange={(v: string) => {
          setOtpValue(v);
          if (v.length === 6) {
            submitOtp(v);
          }
        }}
      />
      <Button fullWidth iconRight={<ArrowRight />} onClick={() => submitOtp(otpValue)}>
        Verify OTP
      </Button>
      {timer > 0 ? (
        <p className="text-muted-foreground text-center">
          Resend OTP in <b>{timer}s</b>
        </p>
      ) : (
        <button
          type="button"
          onClick={resendOtp}
          className="text-primary hover:underline mx-auto block"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}
