import { Server } from "http";

import { Server as SocketIOServer } from "socket.io";

import { CLIENT_URL } from "@/constants";
import { SocketController } from "@/controllers/socket.controller";
import { container } from "@/di/container";
import { TYPES } from "@/di/types";

let io: SocketIOServer;

const setUpSocket = (server: Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const socketController = container.get<SocketController>(TYPES.SocketController);
  socketController.initializeSocket(io);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export default setUpSocket;
