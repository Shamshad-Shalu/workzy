import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { ROLE, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import NotificationService from '@/services/notification.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnreadCount } from '@/store/slices/notificationSlice';
import type { RootState } from '@/store/store';
import type { NotificationListingResponse } from '@/types/notification';

interface SocketNotificationPayload {
  heading?: string;
  message?: string;
}

export const useNotificationCount = (role: Role = ROLE.USER) => {
  const { user, isAuthenticated } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count', user?.id],
    queryFn: () =>
      NotificationService.getNotifications({
        limit: 11,
        read: 'false',
        type: role === ROLE.WORKER ? 'WORKER' : 'USER',
      }),
    enabled: Boolean(isAuthenticated && user?.id),
    staleTime: 15_000,
  });

  useEffect(() => {
    if (unreadData?.notifications) {
      dispatch(setUnreadCount(unreadData.notifications.length));
    }
  }, [unreadData, dispatch]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewNotification = (payload: SocketNotificationPayload) => {
      const cleanMessage = payload.message?.replace(/\*\*(.*?)\*\*/g, '$1');

      if (payload.heading ?? payload.message) {
        toast(payload.heading ?? 'New Notification', {
          description: cleanMessage,
        });
      }

      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted' &&
        document.hidden
      ) {
        new window.Notification(payload.heading ?? 'Workzy Notification', {
          body: cleanMessage ?? 'You have a new notification',
          icon: '/vite.svg',
        });
      }
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('new_notification', handleNewNotification);

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      void Notification.requestPermission();
    }

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, queryClient]);
};

export const useNotifications = (role: Role = ROLE.USER, filterRead?: string) => {
  const { user } = useAppSelector((s: RootState) => s.auth);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['notifications', user?.id, filterRead] as const,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      NotificationService.getNotifications({
        limit: 5,
        cursor: pageParam,
        read: filterRead,
        type: role === ROLE.WORKER ? 'WORKER' : 'USER',
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: NotificationListingResponse) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });

  const notifications = data?.pages.flatMap(page => page.notifications) ?? [];

  return {
    notifications,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export const useNotificationActions = (role: Role = ROLE.USER) => {
  const queryClient = useQueryClient();

  const markAsRead = async (id: string): Promise<void> => {
    await NotificationService.markAsRead(id);
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markAllAsRead = async (): Promise<void> => {
    await NotificationService.markAllAsRead(role === ROLE.WORKER ? 'WORKER' : 'USER');
    void queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return { markAsRead, markAllAsRead };
};
