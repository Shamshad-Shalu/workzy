import { useEffect, useMemo, type ReactNode } from 'react';
import { io } from 'socket.io-client';

import { HOST, MODE } from '@/constants';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

import { SocketContext } from './socket-context';

const baseUrl = MODE === 'development' ? `${HOST}` : '';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user, isAuthenticated } = useAppSelector((s: RootState) => s.auth);

  const socket = useMemo(() => {
    if (!isAuthenticated || !user?.id) {
      return null;
    }

    return io(baseUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: user.id,
      },
    });
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('error', error => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
