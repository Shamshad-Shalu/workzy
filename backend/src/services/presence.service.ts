import { inject, injectable } from "inversify";

import { REDIS_KEYS } from "@/constants";
import { IPresenceService } from "@/core/interfaces/services/IPresenceService";
import { IRedisService } from "@/core/interfaces/services/IRedisService";
import { TYPES } from "@/di/types";

@injectable()
export class PresenceService implements IPresenceService {
  constructor(@inject(TYPES.RedisService) private _redisService: IRedisService) {}

  async registerConnection(participantId: string): Promise<boolean> {
    const count = await this._redisService.hIncrBy(REDIS_KEYS.PRESENCE.ONLINE, participantId, 1);
    return count === 1;
  }

  async removeConnection(participantId: string): Promise<boolean> {
    const count = await this._redisService.hIncrBy(REDIS_KEYS.PRESENCE.ONLINE, participantId, -1);

    if (count <= 0) {
      await Promise.all([
        this._redisService.hDel(REDIS_KEYS.PRESENCE.ONLINE, participantId),
        this._redisService.set(
          REDIS_KEYS.PRESENCE.LAST_SEEN(participantId),
          new Date().toISOString()
        ),
      ]);
      return true;
    }
    return false;
  }

  async isOnline(participantId: string): Promise<boolean> {
    const value = await this._redisService.hGet(REDIS_KEYS.PRESENCE.ONLINE, participantId);
    return value !== null && Number(value) > 0;
  }

  async getLastSeen(participantId: string): Promise<string | null> {
    return await this._redisService.get(REDIS_KEYS.PRESENCE.LAST_SEEN(participantId));
  }
  async getAllOnlineIds(): Promise<string[]> {
    const all = await this._redisService.hGetAll(REDIS_KEYS.PRESENCE.ONLINE);
    return Object.keys(all).filter((id) => Number(all[id]) > 0);
  }
}
