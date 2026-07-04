import { Loader2, Search, WifiOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchInput from '@/components/molecules/SearchInput';
import { ROLE, type Role } from '@/constants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { useChats } from '../hooks/useChats';

import ChatListItem from './ChatListItem';
import ChatListItemSkeleton from './ChatListItemSkeleton';

interface ChatSidebarProps {
  activeChatId?: string;
  role?: Role;
}

export default function ChatSidebar({ activeChatId, role = ROLE.ADMIN }: ChatSidebarProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const {
    chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useChats({ search });
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const getChatPath = (id: string) =>
    role === ROLE.USER ? `/messages/${id}` : `/${role}/messages/${id}`;
  return (
    <aside className="flex flex-col h-full w-full">
      <div className="px-5 pt-5 pb-3 border-b border-border shrink-0">
        <h2 className="text-xl font-semibold tracking-tight mb-3">Messages</h2>
        <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SearchInput
            value={search}
            debounce={800}
            onChange={setSearch}
            variant="inline"
            placeholder="Search chats..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ChatListItemSkeleton key={i} />)
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
            <WifiOff className="h-6 w-6 text-muted-foreground/60" />
            <div>
              <p className="text-sm font-medium">Couldn't load chats</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error?.message}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="text-xs text-primary hover:underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm font-medium text-foreground">No conversations</p>
            <p className="text-xs text-muted-foreground">
              {search ? 'Try a different search' : 'Nothing here yet'}
            </p>
          </div>
        ) : (
          <>
            {chats.map(chat => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                role={role}
                active={activeChatId === chat.id}
                onClick={() => navigate(getChatPath(chat.id))}
              />
            ))}
            <div ref={sentinelRef} className="h-20" />
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
