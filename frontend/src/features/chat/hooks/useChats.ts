import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import ChatService from '@/services/chat.service';
import type { ChatListQuery, ChatRoom } from '@/types/chat';

const LIMIT = 8;

export function useChats(filters: Omit<ChatListQuery, 'limit' | 'cursor'>) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['chats', filters.search, filters.isActive] as const,
    queryFn: ({ pageParam }) =>
      ChatService.getChatRooms({
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
  };
}

export function useCreateChatRoom() {
  const qc = useQueryClient();
  return useMutation<ChatRoom, Error, { bookingId: string }>({
    mutationFn: ({ bookingId }: { bookingId: string }) => ChatService.createChatRoom(bookingId),
    onSuccess: (_data, { bookingId }) => {
      qc.invalidateQueries({ queryKey: ['chats'] });
      qc.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
    },
  });
}
