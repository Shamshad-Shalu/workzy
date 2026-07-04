export interface IPresenceService {
  registerConnection(participantId: string): Promise<boolean>;
  removeConnection(
    participantId: string
  ): Promise<{ isLastConnection: boolean; lastSeen: string | null }>;
  isOnline(participantId: string): Promise<boolean>;
  getLastSeen(participantId: string): Promise<string | null>;
  getAllOnlineIds(): Promise<string[]>;
  forceOffline(participantId: string): Promise<string>;
}
