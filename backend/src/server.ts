import logger from "./config/logger";
import { connectDB } from "./config/db";
import { PORT } from "./constants";
import app from "./app";
import { connectRedis } from "./config/redisClient";

const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();
    app.listen(PORT, () => logger.info(`Server is running on ${PORT}`));
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer();
