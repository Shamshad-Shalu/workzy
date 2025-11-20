import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { refreshAccessToken } from '@/store/slices/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const active = localStorage.getItem('sessionActive');

    if (active === 'true') {
      dispatch(refreshAccessToken());
    }
  }, [dispatch]);

  return <>{children}</>;
}
