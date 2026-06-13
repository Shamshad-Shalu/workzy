import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { ArrowLeft, Loader2, MoreVertical, Search, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import ProfileImage from '@/components/molecules/ProfileImage';
import SearchInput from '@/components/molecules/SearchInput';
import { MESSAGE_TYPE, ROLE, type MessageType, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import { cn } from '@/lib/utils';
import MessageService from '@/services/message.service';
import type { Chat } from '@/types/chat';
import type { ChatMessage, MessagesResponse } from '@/types/chatMessage';
import { formatChatDate } from '@/utils/time.format';

import { useChatMessages, useChatSearch } from '../hooks/useChatMessages';

import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  chat: Chat;
  role?: Role;
}

type FlatItem = { type: 'label'; label: string } | { type: 'message'; data: ChatMessage };

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

function buildFlatList(messages: ChatMessage[]): FlatItem[] {
  const result: FlatItem[] = [];

  groupMessagesByDate(messages).forEach(g => {
    result.push({ type: 'label', label: g.label });
    g.messages.forEach(m => result.push({ type: 'message', data: m }));
  });
  return result;
}

export default function ChatWindow({ chat, role = ROLE.ADMIN }: ChatWindowProps) {
  const queryClient = useQueryClient();
  const { socket, onlineUsers, activeChatIdRef } = useSocket();
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [jumpingTo, setJumpingTo] = useState<string | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ messageId: string; content: string } | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [reply, setReply] = useState<{
    messageId: string;
    content?: string;
    type: MessageType;
    role: Role;
  } | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useChatMessages(
    chat.id
  );
  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    fetchNextPage: fetchMoreSearch,
    hasNextPage: hasMoreSearch,
  } = useChatSearch(chat.id, searchInput);

  const searchResults = useMemo(
    () => searchData?.pages.flatMap(p => p.messages ?? []),
    [searchData]
  );
  const messages = useMemo(
    () =>
      data?.pages
        .slice()
        .reverse()
        .flatMap(p => [...p.messages].reverse()) ?? [],
    [data]
  );
  const flatList = useMemo(() => buildFlatList(messages), [messages]);

  const handleSetReply = useCallback((msg: ChatMessage) => {
    setReply({
      messageId: msg.id,
      content: msg.content,
      type: msg.type,
      role: msg.role,
    });
    setEditing(null);
  }, []);

  const handleSetEdit = useCallback((msg: ChatMessage) => {
    setEditing({ messageId: msg.id, content: msg.content ?? '' });
    setReply(null);
  }, []);

  const handleSubmitEdit = useCallback(
    (messageId: string, content: string) => {
      socket?.emit('editMessage', { messageId, chatId: chat.id, content });
      setEditing(null);
    },
    [socket, chat.id]
  );

  const otherUserId = role === ROLE.USER ? chat.participants.worker.id : chat.participants.user.id;
  const isOnline = onlineUsers.has(otherUserId);
  const isAdmin = role === ROLE.ADMIN;
  const isUser = role === ROLE.USER;
  const profilePart =
    role === ROLE.WORKER ? chat.participants.user : isUser ? chat.participants.worker : null;
  const canToggleBlock = isAdmin || !chat.isBlocked || chat.blockedBy === role;

  const jumpTOMessage = useCallback(
    async (messageId: string) => {
      const idx = flatList.findIndex(item => item.type === 'message' && item.data.id === messageId);

      if (idx !== -1) {
        virtuosoRef.current?.scrollToIndex({ index: idx, behavior: 'smooth', align: 'center' });
        setHighlightId(messageId);
        setTimeout(() => setHighlightId(cur => (cur === messageId ? null : cur)), 1800);
        return;
      }
      setJumpingTo(messageId);

      try {
        const { messages: contextMsgs, nextCursor } = await MessageService.getMessageContext(
          chat.id,
          messageId,
          20
        );
        queryClient.setQueryData<InfiniteData<MessagesResponse>>(
          ['chat-messages', chat.id],
          old => {
            if (!old) {
              return {
                pages: [{ messages: contextMsgs, nextCursor }],
                pageParams: [undefined],
              };
            }

            // Check if any of these messages are already cached (avoid duplicates)
            const existingIds = new Set(old.pages.flatMap(p => p.messages.map(m => m.id)));
            const newMsgs = contextMsgs.filter(m => !existingIds.has(m.id));
            if (newMsgs.length === 0) {
              return old;
            }

            // Append the context page after existing pages (since it's older content, it belongs at the end of the pages array)
            return {
              ...old,
              pages: [...old.pages, { messages: newMsgs, nextCursor }],
              pageParams: [...old.pageParams, undefined],
            };
          }
        );
        // After cache update, scroll on next render
        setTimeout(() => {
          const newFlatList = buildFlatList(
            queryClient
              .getQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id])
              ?.pages.slice()
              .reverse()
              .flatMap(p => [...p.messages].reverse()) ?? []
          );
          const newIdx = newFlatList.findIndex(
            item => item.type === 'message' && item.data.id === messageId
          );
          if (newIdx !== -1) {
            virtuosoRef.current?.scrollToIndex({
              index: newIdx,
              behavior: 'smooth',
              align: 'center',
            });
          }
          setHighlightId(messageId);
          setTimeout(() => setHighlightId(cur => (cur === messageId ? null : cur)), 1800);
        }, 80);
      } finally {
        setJumpingTo(null);
      }
    },
    [flatList, chat.id, queryClient]
  );

  useEffect(() => {
    queryClient.setQueriesData<InfiniteData<{ chats: Chat[]; nextCursor: string | null }>>(
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

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchInput('');
    setHighlightId(null);
  };

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.chatId !== chat.id) {
        return;
      }

      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }

        const pages = [...old.pages];

        // Find the oldest pending message index of the same type and role to replace
        let pendingMsgIdx = -1;
        for (let i = pages[0].messages.length - 1; i >= 0; i--) {
          const m = pages[0].messages[i];
          if (m.id.startsWith('temp-') && m.role === msg.role && m.type === msg.type) {
            pendingMsgIdx = i;
            break;
          }
        }

        if (pendingMsgIdx !== -1) {
          const tempId = pages[0].messages[pendingMsgIdx].id;
          setPendingIds(prev => {
            const n = new Set(prev);
            n.delete(tempId);
            return n;
          });
          pages[0] = {
            ...pages[0],
            messages: pages[0].messages.map((m, idx) => (idx === pendingMsgIdx ? msg : m)),
          };
        } else {
          // Fallback duplicate check and insert
          const isDuplicate = pages.some(p => p.messages.some(m => m.id === msg.id));
          if (isDuplicate) {
            return old;
          }
          pages[0] = {
            ...pages[0],
            messages: [msg, ...pages[0].messages],
          };
        }

        return { ...old, pages };
      });

      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'smooth' });
      }, 50);

      queryClient.setQueriesData<InfiniteData<{ chats: Chat[]; nextCursor: string | null }>>(
        { queryKey: ['chats'], exact: false },

        old => {
          if (!old) {
            return old;
          }

          let targetChat: Chat | undefined;
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

          const updatedChat: Chat = {
            ...targetChat,
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

  const handleMessageEdited = useCallback(
    ({ messageId, content }: { messageId: string; content: string }) => {
      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
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

      queryClient.setQueriesData<InfiniteData<{ chats: Chat[]; nextCursor: string | null }>>(
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
      queryClient.setQueryData<Chat>(['chat', chatId], old => {
        if (!old) {
          return old;
        }
        return { ...old, isBlocked, blockedBy: blockedBy ?? undefined };
      });

      queryClient.setQueriesData<InfiniteData<{ chats: Chat[]; nextCursor: string | null }>>(
        { queryKey: ['chats'], exact: false },
        old => {
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
        }
      );
    },
    [queryClient]
  );

  const handleConfirmBlock = () => {
    socket?.emit('toggleChatStatus', { chatId: chat.id });
    setIsBlockModalOpen(false);
  };

  const handleBlockToggleClick = () => {
    if (chat.isBlocked) {
      socket?.emit('toggleChatStatus', { chatId: chat.id });
    } else {
      setIsBlockModalOpen(true);
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit('joinRoom', { chatId: chat.id });
    socket.on('newMessage', handleNewMessage);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageEdited', handleMessageEdited);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('chatToggled', handleChatToggled);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageEdited', handleMessageEdited);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('chatToggled', handleChatToggled);
    };
  }, [
    socket,
    chat.id,
    handleNewMessage,
    handleMessageDeleted,
    handleMessageEdited,
    handleMessagesRead,
    handleChatToggled,
  ]);

  const handleLocalMessage = useCallback(
    (payload: { type: string; content?: string; mediaUrl?: string }) => {
      const tempId = `temp-${Date.now()}`;
      setPendingIds(prev => new Set(prev).add(tempId));

      const optimisticMsg: ChatMessage = {
        id: tempId,
        chatId: chat.id,
        role: role as Role,
        type: payload.type as MessageType,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        replyTo: reply
          ? {
              messageId: reply.messageId,
              content: reply.content,
              type: reply.type,
              role: reply.role,
            }
          : undefined,
        readByRoles: [],
        createdAt: new Date(),
        isDeleted: false,
        isEdited: false,
      };

      queryClient.setQueryData<InfiniteData<MessagesResponse>>(['chat-messages', chat.id], old => {
        if (!old) {
          return old;
        }
        const pages = [...old.pages];
        pages[0] = {
          ...pages[0],
          messages: [optimisticMsg, ...pages[0].messages],
        };
        return { ...old, pages };
      });

      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'smooth' });
      }, 50);

      // We still need to send it to the socket
      socket?.emit('sendMessage', {
        chatId: chat.id,
        type: payload.type,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        replyToMessageId: reply?.messageId,
      });
      setReply(null);
    },
    [chat.id, role, reply, queryClient, socket]
  );

  return (
    <main className="flex flex-1 overflow-hidden h-full bg-muted/30">
      <div className="flex flex-1 flex-col h-full min-w-0">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={isUser ? '/messages' : `/${role}/messages`}
              className="inline-flex items-center gap-0.5 text-primary/80 transition-colors hover:text-primary hover:underline underline-offset-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex-shrink-0">
              {!isAdmin && profilePart ? (
                <div className="relative">
                  <ProfileImage src={profilePart.profileImage} name={profilePart.name} size={43} />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                  )}
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                  {chat.chatId.slice(-4)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {profilePart ? profilePart.name : chat.chatId}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="opacity-40">·</span>
                {isAdmin ? (
                  <span className="truncate">
                    <Link
                      to={`/admin/users/${chat.participants.user.id}`}
                      className="py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {' '}
                      {chat.participants.user.name}
                    </Link>
                    {''} ↔ {''}
                    <Link
                      to={`/admin/workers/${chat.participants.worker.id}`}
                      className="py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {' '}
                      {chat.participants.worker.name}
                    </Link>
                  </span>
                ) : (
                  <span className={cn(isOnline ? 'text-emerald-500' : 'text-muted-foreground')}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className={cn(
                'rounded-full p-2 transition-colors hover:bg-accent',
                searchOpen ? 'bg-accent text-foreground' : 'text-muted-foreground'
              )}
              title="Search messages"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <Button
              disabled={!canToggleBlock}
              onClick={handleBlockToggleClick}
              variant="ghost"
              className={cn(
                chat.isBlocked
                  ? 'text-green-600 hover:bg-green-600/10 transition-colors'
                  : 'text-destructive hover:bg-destructive/10 transition-colors'
              )}
            >
              {isAdmin && chat.isBlocked
                ? 'Unblock'
                : chat.blockedBy === role
                  ? 'Unblock'
                  : chat.isBlocked
                    ? 'Blocked'
                    : 'Block'}
            </Button>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
              <MoreVertical size={18} />
            </button>
          </div>
        </header>
        <div className="flex-1 min-h-0 pb-2 pl-4 ">
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%' }}
            data={flatList}
            initialTopMostItemIndex={flatList.length > 0 ? flatList.length - 1 : 0}
            followOutput="smooth"
            increaseViewportBy={{ top: 0, bottom: 0 }}
            atTopStateChange={atTop => {
              if (atTop && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            components={{
              Scroller: forwardRef<HTMLDivElement, { style?: React.CSSProperties }>(
                ({ style, ...props }, ref) => (
                  <div ref={ref} {...props} className="custom-scrollbar" style={style} />
                )
              ),
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
                ) : (
                  <div className="h-4" />
                ),
            }}
            itemContent={(_, item: FlatItem) => {
              if (item.type === 'label') {
                return (
                  <div className="flex justify-center my-3">
                    <span className="rounded-full bg-card border border-border px-3 py-1 text-xs text-muted-foreground shadow-sm">
                      {item.label}
                    </span>
                  </div>
                );
              }
              const msg = item.data;
              if (msg.type === MESSAGE_TYPE.BOOKING_EVENT) {
                return (
                  <div className="flex justify-center my-2 px-4 mb-2">
                    <div className="bg-primary/10 border border-primary/30 px-5 py-2 rounded-full max-w-[80%] text-center">
                      <p className="text-sm font-medium text-foreground">{msg.content}</p>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  className={cn(
                    'w-full rounded-2xl transition-all duration-300 mb-1 pr-3',
                    highlightId === msg.id &&
                      'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                >
                  <MessageBubble
                    chat={chat}
                    message={item.data}
                    currentRole={role}
                    onReply={handleSetReply}
                    onEdit={handleSetEdit}
                    onJumpToMessage={jumpTOMessage}
                    isPending={pendingIds.has(msg.id)}
                  />
                </div>
              );
            }}
          />
        </div>
        {chat.isBlocked ? (
          <div className="border-t bg-card p-4 shrink-0">
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="font-medium">Conversation closed</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This booking is no longer active. Messaging has been disabled.
              </p>
            </div>
          </div>
        ) : (
          <MessageInput
            chatId={chat.id}
            role={role}
            replyTo={reply}
            onCancelReply={() => setReply(null)}
            onLocalMessage={handleLocalMessage}
            editingMessageId={editing?.messageId}
            editingContent={editing?.content}
            onCancelEdit={() => setEditing(null)}
            onSubmitEdit={handleSubmitEdit}
          />
        )}
        <AppModal
          open={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          confirmText="Block"
          buttonVariant="red"
          title="Block this conversation?"
          onConfirm={handleConfirmBlock}
        >
          <div className="text-sm text-muted-foreground">
            Blocking will prevent both parties from sending messages.
          </div>
        </AppModal>
      </div>
      {searchOpen && (
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-l border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h4 className="text-sm font-semibold">Search Messages</h4>
            <button
              onClick={closeSearch}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <SearchInput
                value={searchInput}
                debounce={800}
                onChange={setSearchInput}
                variant="inline"
                placeholder="Search messages..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchInput && !searchLoading && (
              <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
                {searchResults?.length} result{searchResults?.length === 1 ? '' : 's'}
              </p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {!searchInput && (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Search for messages within this conversation.
                </p>
              </div>
            )}
            {searchLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : searchError ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-xs text-muted-foreground">{searchError.message}</p>
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-xs text-muted-foreground">No messages found.</p>
              </div>
            ) : (
              searchResults?.map(m => {
                const q = searchInput.trim();
                const text = m.content ?? '';
                const idx = text.toLowerCase().indexOf(q.toLowerCase());
                const before = idx >= 0 ? text.slice(0, idx) : text;
                const match = idx >= 0 ? text.slice(idx, idx + q.length) : '';
                const after = idx >= 0 ? text.slice(idx + q.length) : '';
                const senderName = m.role === role ? 'You' : (profilePart?.name ?? m.role);
                const isJumping = jumpingTo === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => jumpTOMessage(m.id)}
                    disabled={!!jumpingTo}
                    className="w-full text-left px-3 py-3 hover:bg-muted transition-colors border-b border-border/40 disabled:opacity-60"
                  >
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className="text-xs font-medium text-foreground truncate">
                        {senderName}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {isJumping && (
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {formatChatDate(m.createdAt, 'smart')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {before}
                      {match && (
                        <mark className="bg-primary/30 text-foreground rounded px-0.5">
                          {match}
                        </mark>
                      )}
                      {after}
                    </p>
                  </button>
                );
              })
            )}
            {hasMoreSearch && (
              <button
                onClick={() => fetchMoreSearch()}
                className="w-full py-3 text-xs text-primary hover:underline"
              >
                Load more results
              </button>
            )}
          </div>
        </aside>
      )}
    </main>
  );
}
