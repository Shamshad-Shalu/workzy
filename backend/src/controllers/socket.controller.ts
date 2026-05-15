import { injectable } from "inversify";
import { Server as SocketIOServer, Socket } from "socket.io";

import logger from "@/config/logger";

@injectable()
export class SocketController {
  private userSocketMap: Map<string, string> = new Map();

  public initializeSocket(io: SocketIOServer): void {
    io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) {
        socket.disconnect();
        return;
      }

      this.userSocketMap.set(userId, socket.id);

      socket.join(userId);
      // logger.info(`User connected: ${userId} with socket ID: ${socket.id}`);

      socket.on("sendMessage", (data) => {
        logger.info(`Message received from ${userId}:`, data);
      });

      socket.on("createChat", (otherUserId) => {
        logger.info(`Chat creation requested by ${userId} with ${otherUserId}`);
      });

      socket.on("markMessagesAsRead", (data) => {
        logger.info(`Messages mark as read by ${userId}:`, data);
      });

      socket.on("disconnect", () => {
        this.userSocketMap.delete(userId);
        logger.info(`User disconnected from socket: ${userId}`);
      });
    });
  }
}
