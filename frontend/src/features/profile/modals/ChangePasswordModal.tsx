import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import PasswordInput from '@/components/atoms/PasswordInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from '@/features/profile/validation/passwordShema';

import { useProfile } from '../hooks/useProfile';



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
    const res = await changePassword(data.currentPassword, data.newPassword);
    reset();
    onOpenChange(false);
    toast.success(res.message);
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
