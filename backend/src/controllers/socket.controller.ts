import { inject, injectable } from "inversify";
import { Server as SocketIOServer, Socket } from "socket.io";

import logger from "@/config/logger";
import { ROLE } from "@/constants";
import { MessageType, SenderRole } from "@/constants/chat";
import { ISocketService } from "@/core/interfaces/services/ISocketService";
import { TYPES } from "@/di/types";

@injectable()
export class SocketController {
  private onlineUsers = new Set<string>();

  constructor(@inject(TYPES.SocketService) private _socketService: ISocketService) {}

  public initializeSocket(io: SocketIOServer): void {
    io.on("connection", (socket: Socket) => {
      const role = socket.handshake.query.role as SenderRole;
      const participantId = this.resolveParticipantId(socket, role);

      if (!participantId) {
        socket.disconnect();
        return;
      }

      this.onlineUsers.add(participantId);
      socket.join(participantId);

      socket.emit("onlineUsers", Array.from(this.onlineUsers));
      socket.broadcast.emit("userOnline", { userId: participantId });

      socket.on("joinRoom", async ({ chatId }: { chatId: string }) => {
        try {
          const result = await this._socketService.handleJoinRoom({
            chatId,
            participantId,
            role,
          });
          socket.join(result.chatId);
          socket.emit("joinedRoom", { chatId: result.chatId });
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : "Failed to join room";
          socket.emit("error", { message: msg });
        }
      });

      socket.on(
        "sendMessage",
        async ({
          chatId,
          type,
          content,
          mediaUrl,
          replyToMessageId,
        }: {
          chatId: string;
          type: MessageType;
          content?: string;
          mediaUrl?: string;
          replyToMessageId?: string;
        }) => {
          try {
            await this._socketService.handleSendMessage({
              chatId,
              participantId,
              role,
              type,
              content,
              mediaUrl,
              replyToMessageId,
            });
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to send message";
            socket.emit("error", { message: msg });
          }
        }
      );

      socket.on(
        "deleteMessage",
        async ({ messageId, chatId }: { messageId: string; chatId: string }) => {
          try {
            const result = await this._socketService.handleDeleteMessage({
              messageId,
              chatId,
              participantId,
              role,
            });
            io.to(chatId).emit("messageDeleted", {
              messageId: result.messageId,
              chatId: result.chatId,
            });
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to delete message";
            socket.emit("error", { message: msg });
          }
        }
      );

      socket.on(
        "editMessage",
        async ({
          messageId,
          chatId,
          content,
        }: {
          messageId: string;
          chatId: string;
          content: string;
        }) => {
          try {
            const result = await this._socketService.handleEditMessage({
              messageId,
              chatId,
              participantId,
              role,
              content,
            });
            io.to(chatId).emit("messageEdited", {
              messageId: result.messageId,
              chatId: result.chatId,
              content: result.content,
            });
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to edit message";
            socket.emit("error", { message: msg });
          }
        }
      );

      socket.on("toggleChatStatus", async ({ chatId }: { chatId: string }) => {
        try {
          const { blockedBy, userId, workerId, isBlocked } =
            await this._socketService.handleToggleChatStatus({
              chatId,
              participantId,
              role,
            });

          io.to(chatId).emit("chatToggled", {
            chatId: chatId,
            isBlocked: isBlocked,
            blockedBy: blockedBy,
          });

          io.to(userId.toString()).emit("chatUpdated", {
            chatId: chatId,
            isBlocked: isBlocked,
            blockedBy: blockedBy,
          });
          io.to(workerId.toString()).emit("chatUpdated", {
            chatId: chatId,
            isBlocked: isBlocked,
            blockedBy: blockedBy,
          });
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : "Failed to toggle chat status";
          socket.emit("error", { message: msg });
        }
      });

      socket.on("markMessagesAsRead", async ({ chatId }: { chatId: string }) => {
        try {
          const result = await this._socketService.handleMarkMessagesAsRead({
            chatId,
            participantId,
            role,
          });
          socket.to(result.chatId).emit("messagesRead", {
            chatId: result.chatId,
            readerId: result.readerId,
          });
        } catch (error: unknown) {
          logger.error(
            `markMessagesAsRead error: ${error instanceof Error ? error.message : "unknown"}`
          );
        }
      });

      socket.on("disconnect", () => {
        this.onlineUsers.delete(participantId);
        socket.broadcast.emit("userOffline", { userId: participantId });
        logger.info(`Disconnected: ${participantId}`);
      });
    });
  }

  private resolveParticipantId(socket: Socket, role: SenderRole): string | undefined {
    const userId = socket.handshake.query.userId as string;
    const workerId = socket.handshake.query.workerId as string | undefined;

    return role === ROLE.WORKER ? workerId : userId;
  }
}
