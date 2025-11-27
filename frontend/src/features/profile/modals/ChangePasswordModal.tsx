import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProfile } from '../hooks/useProfile';
import PasswordInput from '@/components/atoms/PasswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordSchema } from '@/lib/validation/passwordRules';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export default function ChangePasswordModal({ open, onOpenChange }: Props) {
  const { changePassword, loading } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });
  async function onSubmit(data: ChangePasswordSchema) {
    await changePassword(data.currentPassword, data.newPassword);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Label>Current password</Label>
        <PasswordInput
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
          placeholder="Enter your password"
        />
        <Label>New password</Label>
        <PasswordInput
          {...register('newPassword')}
          error={errors.newPassword?.message}
          placeholder="Enter new password"
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting || loading}
            disabled={!isValid}
          >
            Change Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
