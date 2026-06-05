import { useInfiniteQuery } from '@tanstack/react-query';

import MessageService from '@/services/message.service';

const LIMIT = 8;

export function useChatMessages(chatId?: string) {
  return useInfiniteQuery({
    queryKey: ['chat-messages', chatId] as const,
    queryFn: ({ pageParam }) =>
      MessageService.getMessages(chatId!, {
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),
    enabled: !!chatId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
