import { createContext, type MutableRefObject } from 'react';

import type { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
  lastSeenMap: Map<string, string | null>;
  activeChatIdRef: MutableRefObject<string | null>;
}

export const SocketContext = createContext<SocketContextType | null>(null);
