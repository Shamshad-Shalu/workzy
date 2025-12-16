import { Lock, Mail, Pencil, Phone } from 'lucide-react';

interface AccountChangeActionsProps {
  onChangeEmail?: () => void;
  onChangePhone?: () => void;
  onChangePassword?: () => void;
}

export default function AccountChangeActions({
  onChangeEmail,
  onChangePhone,
  onChangePassword,
}: AccountChangeActionsProps) {
  return (
    <div className="w-full space-y-3">
      <button
        onClick={onChangeEmail}
        className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
      >
        <span className="flex items-center gap-2">
          <Mail size={18} /> Change Email
        </span>
        <Pencil className="w-4 h-4" />
      </button>

      <button
        onClick={onChangePhone}
        className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
      >
        <span className="flex items-center gap-2">
          <Phone size={18} /> Change Phone
        </span>
        <Pencil className="w-4 h-4" />
      </button>

      <button
        onClick={onChangePassword}
        className="w-full flex items-center justify-between bg-muted/40 p-3 rounded-lg"
      >
        <span className="flex items-center gap-2">
          <Lock size={18} /> Change Password
        </span>
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}
