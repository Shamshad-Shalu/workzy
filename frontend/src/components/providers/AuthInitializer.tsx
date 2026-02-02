import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshAccessToken } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { bootstrapUserProfile } from '@/store/thunks/userThunks';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status, user } = useAppSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(refreshAccessToken());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'succeeded' && user?.role !== 'admin') {
      dispatch(bootstrapUserProfile());
    }
  }, [status, dispatch, user?.role]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <span className="text-xl font-semibold text-muted-foreground"></span>
      </div>
    );
  }

  return <>{children}</>;
}
