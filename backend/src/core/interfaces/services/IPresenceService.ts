export interface IPresenceService {
  registerConnection(participantId: string): Promise<boolean>;
  removeConnection(participantId: string): Promise<boolean>;
  isOnline(participantId: string): Promise<boolean>;
  getLastSeen(participantId: string): Promise<string | null>;
  getAllOnlineIds(): Promise<string[]>;
}
