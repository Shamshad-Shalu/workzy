import { useQuery } from '@tanstack/react-query';

import ChatService from '@/services/chat.service';

export function useActiveChat(chatId?: string) {
  return useQuery({
    queryKey: ['chat', chatId] as const,
    queryFn: () => ChatService.getById(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
