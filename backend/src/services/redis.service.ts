import { injectable } from "inversify";

import logger from "@/config/logger";
import redisClient from "@/config/redisClient";
import { REDIS_EXPIRY } from "@/constants";
import { IRedisService } from "@/core/interfaces/services/IRedisService";

@injectable()
export class RedisService implements IRedisService {
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await redisClient.set(key, value);
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
    }
  }

  async setWithTTL(key: string, value: string, ttlSeconds: number = REDIS_EXPIRY): Promise<void> {
    try {
      await redisClient.set(key, value, { EX: ttlSeconds });
    } catch (error) {
      logger.error(`Redis SET WITH TTL error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Redis DELETE error for key ${key}:`, error);
    }
  }

  async clearPattern(prefix: string): Promise<void> {
    try {
      const stream = redisClient.scanIterator({
        MATCH: `${prefix}:*`,
        COUNT: 100,
      });

      const pipeline = redisClient.multi();

      pipeline.del(prefix);

      for await (const key of stream) {
        pipeline.del(key);
      }

      await pipeline.exec();
    } catch (error) {
      logger.error(`Redis CLEAR PATTERN error for ${prefix}:`, error);
    }
  }
  async deleteMany(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;
      const pipeline = redisClient.multi();
      for (const key of keys) pipeline.del(key);
      await pipeline.exec();
    } catch (error) {
      logger.error(`Redis DELETE MANY error:`, error);
    }
  }
}
