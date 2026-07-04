import { Loader2, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import SearchInput from '@/components/molecules/SearchInput';
import { ROLE, type Role } from '@/constants';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Chat } from '@/types/chat';
import { formatChatDate } from '@/utils/time.format';

import { useChatSearch } from '../hooks/useChatMessages';

interface MessageSearchPanelProps {
  chat: Chat;
  role: Role;
  onClose: () => void;
  onJump: (messageId: string) => void;
  jumpingToId: string | null;
}

export default function MessageSearchPanel({
  chat,
  role,
  onClose,
  onJump,
  jumpingToId,
}: MessageSearchPanelProps) {
  const [search, setSearch] = useState('');

  const { data, isLoading, error, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChatSearch(chat.id, search);

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const results = useMemo(() => data?.pages.flatMap(p => p.messages ?? []), [data]);
  const profilePart =
    role === ROLE.WORKER
      ? chat.participants.user
      : role === ROLE.USER
        ? chat.participants.worker
        : null;

  return (
    <aside
      className="flex flex-col border-l border-border bg-card
      absolute inset-0 z-20 md:relative md:inset-auto md:z-auto
      w-full md:w-72 md:shrink-0"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h4 className="text-sm font-semibold">Search Messages</h4>
        <button
          onClick={onClose}
          aria-label="Close search"
          className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <SearchInput
            value={search}
            debounce={700}
            onChange={setSearch}
            variant="inline"
            placeholder="Search messages..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── results ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!search && (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <p className="text-xs text-muted-foreground">
              Search for messages within this conversation.
            </p>
          </div>
        )}

        {search && isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {search && isError && (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        )}

        {search && !isLoading && !isError && results?.length === 0 && (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <p className="text-xs text-muted-foreground">No messages found.</p>
          </div>
        )}

        {results?.map(m => {
          const q = search.trim();
          const text = m.content ?? '';
          const matchIdx = text.toLowerCase().indexOf(q.toLowerCase());
          const before = matchIdx >= 0 ? text.slice(0, matchIdx) : text;
          const match = matchIdx >= 0 ? text.slice(matchIdx, matchIdx + q.length) : '';
          const after = matchIdx >= 0 ? text.slice(matchIdx + q.length) : '';
          const senderName = m.role === role ? 'You' : (profilePart?.name ?? m.role);
          const isJumping = jumpingToId === m.id;

          return (
            <button
              key={m.id}
              onClick={() => onJump(m.id)}
              disabled={!!jumpingToId}
              className="w-full text-left px-3 py-3 hover:bg-muted transition-colors border-b border-border/40 disabled:opacity-60"
            >
              <div className="flex items-center justify-between mb-0.5 gap-2">
                <span className="text-xs font-medium text-foreground truncate">{senderName}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {isJumping && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">
                    {formatChatDate(m.createdAt, 'smart')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {before}
                {match && (
                  <mark className="bg-primary/30 text-foreground rounded px-0.5">{match}</mark>
                )}
                {after}
              </p>
            </button>
          );
        })}

        <div ref={sentinelRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </aside>
  );
}
