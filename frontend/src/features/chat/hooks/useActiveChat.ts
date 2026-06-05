import { useQuery } from '@tanstack/react-query';

import ChatService from '@/services/chat.service';

export function useActiveChat(chatId?: string) {
  return useQuery({
    queryKey: ['chat', chatId] as const,
    queryFn: () => ChatService.getRoomById(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
