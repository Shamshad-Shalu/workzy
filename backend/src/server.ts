import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { connectRedis } from "./config/redisClient";
import { PORT } from "./constants";

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
