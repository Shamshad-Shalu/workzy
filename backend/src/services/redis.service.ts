import { injectable } from "inversify";

import logger from "@/config/logger";
import redisClient from "@/config/redisClient";
import { REDIS, REDIS_EXPIRY } from "@/constants";
import { IRedisService } from "@/core/interfaces/services/IRedisService";

@injectable()
export class RedisService implements IRedisService {
  async get(key: string): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(REDIS.GET_ERROR(key), error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await redisClient.set(key, value);
    } catch (error) {
      logger.error(REDIS.SET_ERROR(key), error);
    }
  }

  async setWithTTL(key: string, value: string, ttlSeconds: number = REDIS_EXPIRY): Promise<void> {
    try {
      await redisClient.set(key, value, { EX: ttlSeconds });
    } catch (error) {
      logger.error(REDIS.SET_TTL_ERROR(key), error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(REDIS.DELETE_ERROR(key), error);
    }
  }
  // async clearPattern(prefix: string): Promise<void> {
  //   try {
  //     if (!prefix) return;

  //     const stream = redisClient.scanIterator({
  //       MATCH: `${prefix}:*`,
  //       COUNT: 100,
  //     });

  //     let pipeline = redisClient.multi();
  //     let pending = 0;

  //     for await (const key of stream) {
  //       if (!key) continue;

  //       pipeline.unlink(key);
  //       pending++;

  //       if (pending >= 100) {
  //         await pipeline.exec();
  //         pipeline = redisClient.multi();
  //         pending = 0;
  //       }
  //     }

  //     if (pending > 0) {
  //       await pipeline.exec();
  //     }

  //     logger.info(REDIS.CLEAR_PATTERN_SUCCESS(prefix));
  //   } catch (error) {
  //     logger.error(REDIS.CLEAR_PATTERN_ERROR(prefix), error);
  //   }
  // }
  async clearPattern(prefix: string): Promise<void> {
    try {
      await redisClient.del(prefix);
      const pattern = `${prefix}:*`;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      logger.info(REDIS.CLEAR_PATTERN_SUCCESS(prefix));
    } catch (error) {
      logger.error(REDIS.CLEAR_PATTERN_ERROR(prefix), error);
      console.log("error:", error);
    }
  }
  async deleteMany(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;
      await redisClient.del(keys);
    } catch (error) {
      logger.error(REDIS.DELETE_MANY_ERROR, error);
    }
  }
}
