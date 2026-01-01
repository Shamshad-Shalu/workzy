import { createClient } from "redis";
import logger from "./logger";

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Error: ", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Connected to Redis!");
  }
};

export default redisClient;
