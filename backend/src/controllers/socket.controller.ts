import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";

import logger from "@/config/logger";
import { ROLE } from "@/constants";
import { SenderRole } from "@/constants/chat";
import { IPresenceService } from "@/core/interfaces/services/IPresenceService";
import { TYPES } from "@/di/types";

import { ChatSocketController } from "./chat-socket.controller";

@injectable()
export class SocketController {
  constructor(
    @inject(TYPES.PresenceService) private _presenceService: IPresenceService,
    @inject(TYPES.ChatSocketController) private _chatSocketController: ChatSocketController
  ) {}
  public initializeSocket(io: Server): void {
    io.on("connection", (socket: Socket) => {
      const role = socket.handshake.query.role as SenderRole;
      const participantId = this.resolveParticipantId(socket, role);

      if (!participantId) {
        socket.disconnect();
        return;
      }

      socket.data.participantId = participantId;
      socket.data.role = role;

      socket.join(participantId);
      void this.handleConnect(socket, participantId);

      this._chatSocketController.registerHandlers(io, socket, participantId, role);

      socket.on("disconnect", () => {
        void this.handleDisconnect(socket, participantId);
      });
    });
  }

  private async handleConnect(socket: Socket, participantId: string): Promise<void> {
    try {
      const isFirstConnection = await this._presenceService.registerConnection(participantId);

      const onlineIds = await this._presenceService.getAllOnlineIds();
      socket.emit("onlineUsers", onlineIds);

      if (isFirstConnection) {
        socket.broadcast.emit("userOnline", { userId: participantId });
      }
    } catch (error) {
      logger.error(`Presence registerConnection failed for ${participantId}`, error);
    }
  }

  private async handleDisconnect(socket: Socket, participantId: string): Promise<void> {
    try {
      const { isLastConnection, lastSeen } =
        await this._presenceService.removeConnection(participantId);

      if (isLastConnection) {
        socket.broadcast.emit("userOffline", { userId: participantId, lastSeen });
      }
    } catch (error) {
      logger.error(`Presence removeConnection failed for ${participantId}`, error);
    }
  }

  private resolveParticipantId(socket: Socket, role: SenderRole): string | undefined {
    const userId = socket.handshake.query.userId as string;
    const workerId = socket.handshake.query.workerId as string | undefined;

    return role === ROLE.WORKER ? workerId : userId;
  }
}
