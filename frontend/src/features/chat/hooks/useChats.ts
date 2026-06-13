import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import ChatService from '@/services/chat.service';
import type { Chat, ChatListQuery } from '@/types/chat';

const LIMIT = 8;

export function useChats(filters: Omit<ChatListQuery, 'limit' | 'cursor'>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['chats', filters.search] as const,
    queryFn: ({ pageParam }) =>
      ChatService.getChats({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),

    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  const chats = data?.pages.flatMap(page => page.chats) ?? [];

  return {
    chats,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  };
}

export function useGetOrCreateChat() {
  const qc = useQueryClient();
  return useMutation<Chat, Error, { participantId: string }>({
    mutationFn: ({ participantId }: { participantId: string }) =>
      ChatService.getOrCreateChat(participantId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}
