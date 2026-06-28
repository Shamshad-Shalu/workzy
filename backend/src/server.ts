import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import redisClient, { connectRedis } from "./config/redisClient";
import { PORT, REDIS_KEYS } from "./constants";
import setUpSocket from "./socket/socket";

const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();
    await redisClient.del(REDIS_KEYS.PRESENCE.ONLINE);

    const server = app.listen(PORT, () => logger.info(`Server is running on ${PORT}`));
    setUpSocket(server);
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer();
