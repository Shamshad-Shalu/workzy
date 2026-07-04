import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import type { VirtuosoHandle } from 'react-virtuoso';

interface UseMessageNavigationParams {
  messageIndexMap: Map<string, number>;
  virtuosoRef: RefObject<VirtuosoHandle | null>;
  jumpToAnchor: (messageId: string) => Promise<void>;
}

interface UseMessageNavigationResult {
  highlightId: string | null;
  jumpingTo: string | null;
  jumpToMessage: (messageId: string) => Promise<void>;
  highlightMessage: (id: string) => void;
}

export function useMessageNavigation({
  messageIndexMap,
  virtuosoRef,
  jumpToAnchor,
}: UseMessageNavigationParams): UseMessageNavigationResult {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [jumpingTo, setJumpingTo] = useState<string | null>(null);
  const pendingScrollRef = useRef<string | null>(null);

  useEffect(() => {
    pendingScrollRef.current = null;
    setJumpingTo(null);
    setHighlightId(null);
  }, [jumpToAnchor]);

  const highlightMessage = useCallback((id: string) => {
    setHighlightId(id);
    setTimeout(() => setHighlightId(cur => (cur === id ? null : cur)), 1500);
  }, []);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) {
      return;
    }

    const idx = messageIndexMap.get(target);
    if (idx !== undefined) {
      pendingScrollRef.current = null;
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index: idx, behavior: 'smooth', align: 'center' });
        highlightMessage(target);
      }, 100);
    }
  }, [messageIndexMap, highlightMessage, virtuosoRef]);

  const jumpToMessage = useCallback(
    async (messageId: string) => {
      const idx = messageIndexMap.get(messageId);
      if (idx !== undefined) {
        virtuosoRef.current?.scrollToIndex({ index: idx, behavior: 'smooth', align: 'center' });
        highlightMessage(messageId);
        return;
      }
      setJumpingTo(messageId);
      try {
        pendingScrollRef.current = messageId;
        await jumpToAnchor(messageId);
      } catch (err) {
        pendingScrollRef.current = null;
        throw err;
      } finally {
        setJumpingTo(null);
      }
    },
    [messageIndexMap, jumpToAnchor, highlightMessage, virtuosoRef]
  );

  return {
    highlightId,
    jumpingTo,
    jumpToMessage,
    highlightMessage,
  };
}
