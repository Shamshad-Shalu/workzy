import OtpInput from '@/components/atoms/OtpInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from '../hooks/useProfile';
import { DialogDescription } from '@radix-ui/react-dialog';
import Button from '@/components/atoms/Button';
import { useOtpTimer } from '@/features/auth/hooks/useOtpTimer';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';

type OtpDataProp = {
  type: 'email' | 'phone';
  value: string;
} | null;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  otpData: OtpDataProp;
}

export default function OtpModal({ open, onOpenChange, otpData }: Props) {
  const [otpValue, setOtpValue] = useState<string>('');
  const { timer, resetTimer } = useOtpTimer(30);
  const { verifyOtp, resendOtp, loading } = useProfile();
  const dispatch = useAppDispatch();

  async function handleSubmitOtp(code: string = otpValue) {
    if (code.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }
    if (!otpData?.type || !otpData?.value) {
      toast.error('Unexpected Error. Please try again later');
      return;
    }
    const res = await verifyOtp(otpData?.type, otpData?.value, code);
    if (res.type === 'email') {
      dispatch(updateUser({ email: res.value }));
    } else {
      dispatch(updateUser({ phone: res.value }));
    }
    toast.success(res.message);
    onOpenChange(false);
  }
  useEffect(() => {
    resetTimer();
  }, [open]);

  const handleResendOtp = async () => {
    if (timer !== 0) {
      return;
    }
    if (!otpData?.type || !otpData?.value) {
      toast.error('Unexpected Error. Please try again later');
      return;
    }
    const res = await resendOtp(otpData?.type, otpData?.value);
    toast.success(res.message);
    resetTimer();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="space-y-4" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>{`Enter the code sent to ${otpData?.value}`}</DialogDescription>
          </DialogHeader>
          <OtpInput
            value={otpValue}
            onChange={(v: string) => {
              setOtpValue(v);
              if (v.length === 6) {
                handleSubmitOtp(v);
              }
            }}
          />
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
              className="text-primary hover:underline mx-auto block"
            >
              Resend OTP
            </button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
