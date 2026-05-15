// import http from "http";

import app from "./app";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { connectRedis } from "./config/redisClient";
import { PORT } from "./constants";
import setUpSocket from "./socket/socket";

const startServer = async () => {
  try {
    await connectRedis();
    await connectDB();

    const server = app.listen(PORT, () => logger.info(`Server is running on ${PORT}`));
    // const server = http.createServer(app);
    setUpSocket(server);
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer();
