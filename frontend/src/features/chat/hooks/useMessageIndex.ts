import { useMemo } from 'react';

import type { ChatMessage } from '@/types/chatMessage';

import type { FlatItem } from '../utils/flatList.utils';

export function useMessageIndex(messages: ChatMessage[], flatList: FlatItem[]) {
  const messageMap = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    for (const msg of messages) {
      map.set(msg.id, msg);
    }
    return map;
  }, [messages]);

  const messageIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    flatList.forEach((item, index) => {
      if (item.type === 'message') {
        map.set(item.data.id, index);
      }
    });
    return map;
  }, [flatList]);

  return { messageMap, messageIndexMap };
}
