import { Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { AppModal } from '@/components/molecules/AppModal';
import { emailRule, phoneRule } from '@/lib/validation/rules';

type ContactType = 'phone' | 'email';

interface ContactChangeModalProps {
  open: boolean;
  onClose: () => void;
  currentValue: string;
  userEmail: string;
  type?: ContactType;
  onConfirm: (value: string) => Promise<void>;
  isPending: boolean;
}

export default function ContactChangeModal({
  open,
  onClose,
  currentValue,
  userEmail,
  type = 'phone',
  onConfirm,
  isPending,
}: ContactChangeModalProps) {
  const [value, setValue] = useState(currentValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(currentValue);
      setError(null);
    }
  }, [open, currentValue]);

  const handleConfirm = async () => {
    const rule = type === 'phone' ? phoneRule : emailRule;
    const result = rule.safeParse(value);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    await onConfirm(value);
    onClose();
  };

  const isPhone = type === 'phone';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isPhone ? 'Change Phone Number' : 'Change Email'}
      description="Update your contact information"
      confirmText={isPhone ? 'Update Phone' : 'Update Email'}
      cancelText="Cancel"
      isConfirmLoading={isPending}
      onConfirm={handleConfirm}
      buttonVariant="blue"
      className="sm:max-w-md"
    >
      <div className="space-y-5">
        <div>
          <Label>{isPhone ? 'New Phone Number' : 'New Email'}</Label>
          <Input
            leftIcon={isPhone ? <Phone size={15} /> : <Mail size={15} />}
            error={error ?? ''}
            type={isPhone ? 'tel' : 'email'}
            placeholder={isPhone ? 'Enter new phone number' : 'Enter new email'}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-section-blue border border-section-blue-border">
          <Mail size={15} className="text-section-blue-text mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-section-blue-text mb-0.5">
              OTP will be sent to your email
            </p>
            <p className="text-xs text-section-blue-text break-all">{userEmail}</p>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
