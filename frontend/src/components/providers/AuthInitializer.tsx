import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshAccessToken } from '@/store/slices/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s: any) => s.auth);

  useEffect(() => {
    const active = localStorage.getItem('sessionActive');

    if (active === 'true' && status === 'idle') {
      dispatch(refreshAccessToken());
    }
  }, [dispatch]);

  const active = localStorage.getItem('sessionActive');
  if (active === 'true' && (status === 'idle' || status === 'loading')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
}
