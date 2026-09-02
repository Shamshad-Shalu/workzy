import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import OtpInput from '@/components/atoms/OtpInput';
import { AppModal } from '@/components/molecules/AppModal';
import { useOtpTimer } from '@/features/auth/hooks/useOtpTimer';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
}

export default function OtpModal({ open, onOpenChange, onResend, onVerify, loading }: Props) {
  const [otpValue, setOtpValue] = useState<string>('');
  const { timer, resetTimer } = useOtpTimer(30);

  async function handleSubmitOtp(code: string = otpValue) {
    if (code.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }
    await onVerify(code);
    onOpenChange(false);
  }

  const handleResendOtp = async () => {
    if (timer !== 0) {
      return;
    }

    await onResend();
    setOtpValue('');
    resetTimer();
  };
  useEffect(() => {
    if (open) {
      resetTimer();
    }
  }, [open, resetTimer]);

  useEffect(() => {
    if (!open) {
      setOtpValue('');
    }
  }, [open]);

  return (
    <AppModal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Verify OTP"
      description="Enter the 6-digit code sent to your email"
      isDescriptionHidden={false}
      canCloseOnOutsideClick={false}
      hideFooter
    >
      <div className="flex flex-col gap-3">
        <OtpInput
          value={otpValue}
          onChange={(v: string) => {
            setOtpValue(v);
            if (v.length === 6) {
              handleSubmitOtp(v);
            }
          }}
        />

        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            loading={loading}
            iconRight={<ArrowRight />}
            onClick={() => handleSubmitOtp(otpValue)}
          >
            Verify OTP
          </Button>

          {timer > 0 ? (
            <p className="text-muted-foreground text-center">
              Resend OTP in <b>{timer}s</b>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-primary hover:underline mx-auto block"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </AppModal>
  );
}
