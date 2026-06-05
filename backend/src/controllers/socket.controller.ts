import { inject, injectable } from "inversify";
import { Server as SocketIOServer, Socket } from "socket.io";

import logger from "@/config/logger";
import { ROLE } from "@/constants";
import { MessageType, SenderRole } from "@/constants/chat";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { TYPES } from "@/di/types";

@injectable()
export class SocketController {
  private onlineUsers = new Set<string>();
  constructor(
    @inject(TYPES.ChatService) private _chatService: IChatService,
    @inject(TYPES.MessageService) private _messageService: IMessageService
  ) {}

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
          const chat = await this._chatService.getChatRoomById({
            chatId,
            participantId,
            role,
          });
          socket.join(chat.id);
          socket.emit("joinedRoom", { chatId: chat.id });
          logger.info(`${participantId} joined room ${chat.id}`);
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
        }: {
          chatId: string;
          type: MessageType;
          content?: string;
          mediaUrl?: string;
        }) => {
          try {
            const savedMsg = await this._messageService.saveMessage({
              chatId,
              senderId: participantId,
              role,
              type,
              content,
              mediaUrl,
            });

            io.to(chatId).emit("newMessage", savedMsg);
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
            await this._messageService.deleteMessage({
              messageId,
              chatId,
              participantId,
              role,
            });
            io.to(chatId).emit("messageDeleted", { messageId });
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to delete message";
            socket.emit("error", { message: msg });
          }
        }
      );

      socket.on("markMessagesAsRead", async ({ chatId }: { chatId: string }) => {
        try {
          await this._chatService.getChatRoomById({ chatId, participantId, role });
          await this._messageService.markRoomMessagesAsRead(chatId, role);
          socket.to(chatId).emit("messagesRead", { chatId, readerId: participantId });
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
