import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import PasswordInput from '@/components/atoms/PasswordInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  changePasswordSchema,
  type ChangePasswordFormType,
} from '@/features/user/profile/validation/passwordShema';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (data: ChangePasswordFormType) => Promise<string>;
}
export default function ChangePasswordModal({ open, onOpenChange, onConfirm }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  async function onSubmit(data: ChangePasswordFormType) {
    const message = await onConfirm(data);
    reset({ newPassword: '', currentPassword: '' });
    onOpenChange(false);
    toast.success(message);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Label>Current password</Label>
        <PasswordInput
          {...register('currentPassword', {
            setValueAs: v => v.trim(),
          })}
          error={errors.currentPassword?.message}
          placeholder="Enter your password"
        />
        <Label>New password</Label>
        <PasswordInput
          {...register('newPassword', {
            setValueAs: v => v.trim(),
          })}
          error={errors.newPassword?.message}
          placeholder="Enter new password"
        />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting} disabled={!isValid}>
            Change Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
