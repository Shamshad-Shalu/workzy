import redisClient from "@/config/redisClient";

export async function clearRedisListCache(prefixOrKey: string) {
  await redisClient.del(prefixOrKey);
  const pattern = `${prefixOrKey}:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}
