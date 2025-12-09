import redisClient from "@/config/redisClient";

export async function clearRedisListCache(prefix: string) {
  const pattern = `${prefix}:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}
