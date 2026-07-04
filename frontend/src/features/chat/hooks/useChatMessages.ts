import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

import MessageService from '@/services/message.service';
import type { MessagePageParam, MessagesResponse } from '@/types/chatMessage';

const LIMIT = 10;

export function useChatMessages(chatId?: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['chat-messages', chatId] as const, [chatId]);
  const isJumpingRef = useRef(false);

  const infiniteQuery = useInfiniteQuery<
    MessagesResponse,
    Error,
    InfiniteData<MessagesResponse>,
    readonly ['chat-messages', string | undefined],
    MessagePageParam | undefined
  >({
    queryKey,
    queryFn: ({ pageParam }) =>
      MessageService.getMessages(chatId!, {
        limit: LIMIT,
        cursor: pageParam?.cursor ?? null,
        direction: pageParam?.direction ?? 'older',
        messageId: pageParam?.messageId,
      }),
    enabled: !!chatId,
    initialPageParam: undefined,
    getPreviousPageParam: firstPage =>
      firstPage.prevCursor ? { cursor: firstPage.prevCursor, direction: 'newer' } : undefined,
    getNextPageParam: lastPage =>
      lastPage.nextCursor ? { cursor: lastPage.nextCursor, direction: 'older' } : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  const jumpToAnchor = useCallback(
    async (messageId: string) => {
      if (isJumpingRef.current) {
        return;
      }
      isJumpingRef.current = true;
      try {
        const page = await MessageService.getMessages(chatId!, {
          direction: 'around',
          messageId,
          limit: LIMIT,
        });
        if (page.messages.length > 0) {
          queryClient.setQueryData<InfiniteData<MessagesResponse>>(queryKey, {
            pages: [page],
            pageParams: [{ direction: 'around', messageId } as MessagePageParam],
          });
        }
      } finally {
        isJumpingRef.current = false;
      }
    },
    [chatId, queryClient, queryKey]
  );

  const returnToLatest = useCallback(() => {
    queryClient.resetQueries({ queryKey });
  }, [queryClient, queryKey]);

  return { ...infiniteQuery, jumpToAnchor, returnToLatest };
}

export function useChatSearch(chatId?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ['chat-messages-search', chatId, search] as const,
    queryFn: ({ pageParam }) =>
      MessageService.getMessages(chatId!, {
        limit: LIMIT,
        cursor: pageParam ?? null,
        search,
      }),
    enabled: !!chatId && !!search && search.trim().length > 0,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 30 * 1,
  });
}
