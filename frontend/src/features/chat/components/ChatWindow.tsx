import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { ArrowLeft, Loader2, MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { ROLE, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import type { ChatRoom } from '@/types/chat';
import type { ChatMessage, MessagesResponse } from '@/types/chatMessage';
import { formatChatDate } from '@/utils/time.format';

import { useChatMessages } from '../hooks/useChatMessages';

import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  chat: ChatRoom;
  role?: Role;
}

type ChatListItem = { type: 'label'; label: string } | { type: 'message'; data: ChatMessage };

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { label: string; messages: ChatMessage[] }[] = [];

  messages.forEach(msg => {
    const label = formatChatDate(msg.createdAt, 'label');
    const last = groups[groups.length - 1];
    if (!last || last.label !== label) {
      groups.push({ label, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  });

  return groups;
}

export default function ChatWindow({ chat, role = ROLE.ADMIN }: ChatWindowProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useChatMessages(
    chat.id
  );
  const queryClient = useQueryClient();
  const { socket, onlineUsers, activeChatIdRef } = useSocket();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const otherUserId = role === ROLE.USER ? chat.participants.worker.id : chat.participants.user.id;
  const isOnline = onlineUsers.has(otherUserId);

  const messages = useMemo(
    () =>
      data?.pages
        .slice()
        .reverse()
        .flatMap(p => [...p.messages].reverse()) ?? [],
    [data]
  );

  const flatList = useMemo(() => {
    const groups = groupMessagesByDate(messages);
    const result: ChatListItem[] = [];

    groups.forEach(group => {
      result.push({ type: 'label', label: group.label });
      group.messages.forEach(msg => {
        result.push({ type: 'message', data: msg });
      });
    });

    return result;
  }, [messages]);

  useEffect(() => {
    queryClient.setQueriesData<InfiniteData<{ chats: ChatRoom[]; nextCursor: string | null }>>(
      { queryKey: ['chats'], exact: false },
      old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            chats: page.chats.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c)),
          })),
        };
      }
    );
  }, [chat.id, queryClient]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit('markMessagesAsRead', { chatId: chat.id });
  }, [socket, chat.id]);

  useEffect(() => {
    activeChatIdRef.current = chat.id;
    return () => {
      activeChatIdRef.current = null;
    };
  }, [chat.id, activeChatIdRef]);

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.chatId !== chat.id) {
        return;
      }

      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }
        const isDuplicate = old.pages.some(p => p.messages.some(m => m.id === msg.id));
        if (isDuplicate) {
          return old;
        }

        const pages = [...old.pages];
        pages[0] = {
          ...pages[0],
          messages: [msg, ...pages[0].messages],
        };
        return { ...old, pages };
      });

      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'smooth' });
      }, 50);

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
              isDeleted: msg.isDeleted,
            },
            unread: 0,
          };

          return {
            ...old,
            pages: pagesWithoutChat.map((page, i) =>
              i === 0 ? { ...page, chats: [updatedChat, ...page.chats] } : page
            ),
          };
        }
      );
    },
    [chat.id, queryClient]
  );

  const handleMessageDeleted = useCallback(
    ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            messages: page.messages.map(m => (m.id === messageId ? { ...m, isDeleted: true } : m)),
          })),
        };
      });
    },
    [chat.id, queryClient]
  );

  const handleMessagesRead = useCallback(
    ({ readerId }: { chatId: string; readerId: string }) => {
      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }

        const readerRole =
          readerId === chat.participants.user.id
            ? ROLE.USER
            : readerId === chat.participants.worker.id
              ? ROLE.WORKER
              : null;

        if (!readerRole) {
          return old;
        }

        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            messages: page.messages.map(m => {
              if (!m.readByRoles.includes(readerRole)) {
                return { ...m, readByRoles: [...m.readByRoles, readerRole] };
              }
              return m;
            }),
          })),
        };
      });

      queryClient.setQueriesData<InfiniteData<{ chats: ChatRoom[]; nextCursor: string | null }>>(
        { queryKey: ['chats'], exact: false },
        old => {
          if (!old) {
            return old;
          }
          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              chats: page.chats.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c)),
            })),
          };
        }
      );
    },
    [chat.id, chat.participants, queryClient]
  );

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit('joinRoom', { chatId: chat.id });
    socket.on('newMessage', handleNewMessage);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, chat.id, handleNewMessage, handleMessageDeleted, handleMessagesRead]);

  return (
    <main className="flex flex-1 flex-col h-full bg-muted/30">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-1 hover:bg-accent md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
            {chat.chatId.slice(-4)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold tracking-tight">{chat.chatId}</p>
            <p className="truncate text-xs text-muted-foreground">
              {role === ROLE.ADMIN ? (
                <>
                  Booking {chat.bookingId} · {chat.participants.user.name} ↔{' '}
                  {chat.participants.worker.name}
                </>
              ) : (
                <>
                  Booking {chat.bookingId} ·{' '}
                  <span className={isOnline ? 'text-emerald-500' : 'text-muted-foreground'}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {role !== ROLE.ADMIN && (
            <button className="rounded-full p-2 hover:bg-accent">
              <MoreVertical className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
      <div className="flex-1 min-h-0 pb-6 px-4">
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%' }}
          data={flatList}
          initialTopMostItemIndex={flatList.length > 0 ? flatList.length - 1 : 0}
          followOutput="smooth"
          atTopStateChange={atTop => {
            if (atTop && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          components={{
            Header: () =>
              isFetchingNextPage ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : null,
            Footer: () =>
              isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : null,
          }}
          itemContent={(_, item: ChatListItem) => {
            if (item.type === 'label') {
              return (
                <div className="mx-auto flex flex-col">
                  <div className="mx-auto rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm my-3">
                    {item.label}
                  </div>
                </div>
              );
            }
            return <MessageBubble chat={chat} message={item.data} currentRole={role} />;
          }}
        />
      </div>
      <MessageInput chatId={chat.id} role={role} />
    </main>
  );
}
