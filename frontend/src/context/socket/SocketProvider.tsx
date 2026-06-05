import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { io } from 'socket.io-client';

import { HOST, MODE } from '@/constants';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import type { ChatRoom } from '@/types/chat';
import type { ChatMessage } from '@/types/chatMessage';

import { SocketContext } from './socket-context';

const baseUrl = MODE === 'development' ? `${HOST}` : '';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user, isAuthenticated } = useAppSelector((s: RootState) => s.auth);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const activeChatIdRef = useRef<string | null>(null);

  const socket = useMemo(() => {
    if (!isAuthenticated || !user?.id) {
      return null;
    }

    return io(baseUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: user.id,
        role: user.role,
        ...(user.worker?.id ? { workerId: user.worker.id } : {}),
      },
    });
  }, [isAuthenticated, user?.id, user?.role, user?.worker?.id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', reason => console.log('Socket disconnected:', reason));
    socket.on('error', error => console.error('Socket error:', error));

    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    socket.on('userOnline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    socket.on('userOffline', ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // FIX — Global newMessage handler for BACKGROUND chats.
    // ChatWindow handles the active chat (increments messages in cache, keeps
    // unread at 0). This handler only fires for chats that are NOT open,
    // incrementing their unread badge in the sidebar.
    const handleGlobalNewMessage = (msg: ChatMessage) => {
      if (msg.chatId === activeChatIdRef.current) {
        return;
      }

      queryClient.setQueriesData<InfiniteData<{ chats: ChatRoom[]; nextCursor: string | null }>>(
        { queryKey: ['chats'], exact: false },
        old => {
          if (!old) {
            return old;
          }

          let targetChat: ChatRoom | undefined;

          const pagesWithoutChat = old.pages.map(page => ({
            ...page,
            chats: page.chats.filter(c => {
              if (c.id === msg.chatId) {
                targetChat = c;
                return false;
              }
              return true;
            }),
          }));
          if (!targetChat) {
            return old;
          }

          const updatedChat: ChatRoom = {
            ...targetChat,
            lastMessage: {
              type: msg.type,
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
            },
            unread: (targetChat.unread ?? 0) + 1,
          };

          return {
            ...old,
            pages: pagesWithoutChat.map((page, i) =>
              i === 0 ? { ...page, chats: [updatedChat, ...page.chats] } : page
            ),
          };
        }
      );
    };

    socket.on('newMessage', handleGlobalNewMessage);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('onlineUsers');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('newMessage', handleGlobalNewMessage);
      socket.disconnect();
    };
  }, [socket, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, activeChatIdRef }}>
      {children}
    </SocketContext.Provider>
  );
};
