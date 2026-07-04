import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useCallback, useEffect, useLayoutEffect, type RefObject } from 'react';
import { toast } from 'sonner';

import type { MessageType, Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import type { Chat } from '@/types/chat';
import type { ChatMessage, MessagesResponse } from '@/types/chatMessage';

import type { VirtuosoHandle } from 'react-virtuoso';

export interface LocalMessagePayload {
  type: MessageType;
  content?: string;
  mediaUrl?: string;
}

interface UseChatSocketEventsParams {
  chat: Chat;
  role: Role;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  isAtBottomRef: RefObject<boolean>;
  replyMessageId: string | undefined;
  onReplyCleared: () => void;
  hasPreviousPage?: boolean;
  returnToLatest?: () => void;
  onIncomingMessage?: (msg: ChatMessage) => void;
  onOptimisticMessage?: (msg: ChatMessage) => void;
}

type MessagesPage = InfiniteData<MessagesResponse>;
type ChatsPage = InfiniteData<{ chats: Chat[]; nextCursor: string | null }>;

function scrollToBottom(virtuosoRef: RefObject<VirtuosoHandle | null>, delay = 50) {
  setTimeout(
    () => virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'smooth' }),
    delay
  );
}

function updateActiveChatInList(queryClient: ReturnType<typeof useQueryClient>, msg: ChatMessage) {
  queryClient.setQueriesData<ChatsPage>({ queryKey: ['chats'], exact: false }, old => {
    if (!old) {
      return old;
    }

    let target: Chat | undefined;
    const without = old.pages.map(page => ({
      ...page,
      chats: page.chats.filter(c => {
        if (c.id === msg.chatId) {
          target = c;
          return false;
        }
        return true;
      }),
    }));
    if (!target) {
      return old;
    }
    const updated: Chat = {
      ...target,
      lastMessage: {
        messageId: msg.id,
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
      pages: without.map((p, i) => (i === 0 ? { ...p, chats: [updated, ...p.chats] } : p)),
    };
  });
}

export function useChatSocketEvents({
  chat,
  role,
  virtuosoRef,
  isAtBottomRef,
  replyMessageId,
  onReplyCleared,
  hasPreviousPage,
  returnToLatest,
  onIncomingMessage,
  onOptimisticMessage,
}: UseChatSocketEventsParams) {
  const queryClient = useQueryClient();
  const { socket, activeChatIdRef } = useSocket();

  const handleLocalMessage = useCallback(
    (payload: LocalMessagePayload) => {
      if (!socket) {
        toast.error('Not connected to chat. Please wait and try again.');
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        chatId: chat.id,
        role,
        type: payload.type,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        isEdited: false,
        readByRoles: [],
        status: 'pending',
        isDeleted: false,
        createdAt: new Date(),
      };

      queryClient.setQueryData<MessagesPage>(['chat-messages', chat.id], old => {
        if (!old) {
          return {
            pages: [{ messages: [optimistic], nextCursor: null, prevCursor: null }],
            pageParams: [undefined],
          };
        }
        const pages = [...old.pages];
        pages[0] = { ...pages[0], messages: [optimistic, ...pages[0].messages] };
        return { ...old, pages };
      });
      onOptimisticMessage?.(optimistic);
      if (hasPreviousPage) {
        returnToLatest?.();
      } else {
        scrollToBottom(virtuosoRef);
      }

      socket.emit('sendMessage', {
        chatId: chat.id,
        type: payload.type,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        replyToMessageId: replyMessageId,
        tempId,
      });
      onReplyCleared();
    },
    [
      socket,
      chat.id,
      role,
      replyMessageId,
      onReplyCleared,
      queryClient,
      virtuosoRef,
      hasPreviousPage,
      returnToLatest,
      onOptimisticMessage,
    ]
  );

  const handleNewMessage = useCallback(
    (msg: ChatMessage & { tempId?: string }) => {
      if (msg.chatId !== chat.id) {
        return;
      }
      if (hasPreviousPage) {
        if (msg.role === role) {
          returnToLatest?.();
        } else {
          updateActiveChatInList(queryClient, msg);
          onIncomingMessage?.(msg);
        }
        return;
      }
      queryClient.setQueryData<MessagesPage>(['chat-messages', chat.id], old => {
        if (!old) {
          return {
            pages: [{ messages: [msg], nextCursor: null, prevCursor: null }],
            pageParams: [undefined],
          };
        }

        const pages = [...old.pages];
        const tempIdx = msg.tempId ? pages[0].messages.findIndex(m => m.id === msg.tempId) : -1;
        if (tempIdx !== -1) {
          pages[0] = {
            ...pages[0],
            messages: pages[0].messages.map((m, i) => (i === tempIdx ? msg : m)),
          };
          return { ...old, pages };
        }

        const isDuplicate = pages.some(p => p.messages.some(m => m.id === msg.id));
        if (isDuplicate) {
          return old;
        }

        pages[0] = { ...pages[0], messages: [msg, ...pages[0].messages] };
        return { ...old, pages };
      });

      updateActiveChatInList(queryClient, msg);

      const isAtBottom = isAtBottomRef.current;
      const isMyMessage = msg.role === role;

      if (isAtBottom || isMyMessage) {
        if (!isMyMessage) {
          socket?.emit('messageSeen', { chatId: chat.id });
        }
      } else {
        onIncomingMessage?.(msg);
      }
    },
    [
      chat.id,
      queryClient,
      role,
      socket,
      hasPreviousPage,
      returnToLatest,
      onIncomingMessage,
      isAtBottomRef,
    ]
  );

  const handleMessageDeleted = useCallback(
    ({ messageId }: { messageId: string; chatId: string }) => {
      queryClient.setQueryData<MessagesPage>(['chat-messages', chat.id], old => {
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

  const handleMessageEdited = useCallback(
    ({ messageId, content }: { messageId: string; chatId: string; content: string }) => {
      queryClient.setQueryData<MessagesPage>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            messages: page.messages.map(m =>
              m.id === messageId ? { ...m, content, isEdited: true } : m
            ),
          })),
        };
      });
    },
    [chat.id, queryClient]
  );

  const handleMessageStatusUpdate = useCallback(
    (update: {
      chatId: string;
      messageIds?: string[];
      status: 'delivered' | 'seen';
      role: Role;
    }) => {
      if (update.chatId !== chat.id) {
        return;
      }

      queryClient.setQueryData<MessagesPage>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            messages: page.messages.map(m => {
              if (update.messageIds && !update.messageIds.includes(m.id)) {
                return m;
              }

              const newStatus = update.status === 'seen' ? 'read' : 'delivered';
              const finalStatus = m.status === 'read' ? 'read' : newStatus;

              return {
                ...m,
                readByRoles: m.readByRoles.includes(update.role)
                  ? m.readByRoles
                  : [...m.readByRoles, update.role],
                status: finalStatus,
              };
            }),
          })),
        };
      });

      if (update.status === 'seen') {
        queryClient.setQueriesData<ChatsPage>({ queryKey: ['chats'], exact: false }, old => {
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
        });
      }
    },
    [chat.id, queryClient]
  );

  const handleChatToggled = useCallback(
    ({
      chatId,
      isBlocked,
      blockedBy,
    }: {
      chatId: string;
      isBlocked: boolean;
      blockedBy: Role | null;
    }) => {
      queryClient.setQueryData<Chat>(['chat', chatId], old =>
        old ? { ...old, isBlocked, blockedBy: blockedBy ?? undefined } : old
      );
      queryClient.setQueriesData<ChatsPage>({ queryKey: ['chats'], exact: false }, old => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            chats: page.chats.map(c =>
              c.id === chatId ? { ...c, isBlocked, blockedBy: blockedBy ?? undefined } : c
            ),
          })),
        };
      });
    },
    [queryClient]
  );
  useLayoutEffect(() => {
    activeChatIdRef.current = chat.id;
    return () => {
      activeChatIdRef.current = null;
    };
  }, [chat.id, activeChatIdRef]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    let isFirstCall = true;
    const setupRoom = () => {
      socket.emit('joinChat', { chatId: chat.id });
      socket.emit('messageSeen', { chatId: chat.id });
      if (!isFirstCall) {
        queryClient.invalidateQueries({ queryKey: ['chat-messages', chat.id] });
      }
      isFirstCall = false;
    };

    if (socket.connected) {
      setupRoom();
    }
    socket.on('connect', setupRoom);

    return () => {
      socket.off('connect', setupRoom);
    };
  }, [socket, chat.id, queryClient]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('newMessage', handleNewMessage);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageEdited', handleMessageEdited);
    socket.on('messageStatusUpdate', handleMessageStatusUpdate);
    socket.on('chatBlocked', handleChatToggled);
    socket.on('chatUnblocked', handleChatToggled);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageEdited', handleMessageEdited);
      socket.off('messageStatusUpdate', handleMessageStatusUpdate);
      socket.off('chatBlocked', handleChatToggled);
      socket.off('chatUnblocked', handleChatToggled);
    };
  }, [
    socket,
    handleNewMessage,
    handleMessageDeleted,
    handleMessageEdited,
    handleMessageStatusUpdate,
    handleChatToggled,
  ]);

  useEffect(() => {
    queryClient.setQueriesData<ChatsPage>({ queryKey: ['chats'], exact: false }, old => {
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
    });
  }, [chat.id, queryClient]);

  return { handleLocalMessage };
}
