import { Server as SocketIOServer, Socket } from "socket.io";

import { SenderRole } from "@/constants";

export interface IChatSocketController {
  registerHandlers(
    io: SocketIOServer,
    socket: Socket,
    participantId: string,
    role: SenderRole
  ): void;
}
