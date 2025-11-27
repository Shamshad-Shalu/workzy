import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { User } from '@/types/user';
import { Mail, Phone, Lock, Pencil, Camera } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface UserProfileCardProps {
  user: User;
  onChangeEmail?: () => void;
  onChangePhone?: () => void;
  onChangePassword?: () => void;
  onChangeImage?: () => void;
}

export default function UserProfileCard({
  user,
  onChangeEmail,
  onChangePhone,
  onChangePassword,
  onChangeImage,
}: UserProfileCardProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const { uploadImage } = useProfile();
  const dispatch = useAppDispatch();

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file);
      dispatch(updateUser({ profileImage: res.url } as any));
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-card rounded-xl border p-6 flex flex-col items-center gap-4">
      <div className="relative w-28 h-28">
        <img
          onClick={onChangeImage}
          src={user.profileImage}
          className="w-28 h-28 rounded-full object-cover border-2 border-bg-accent/30"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 right-0 bg-white border rounded-full p-2 shadow"
        >
          <Camera size={18} className="text-gray-700" />
        </button>
        <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <Separator />
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
    </div>
  );
}
