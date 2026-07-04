import { inject, injectable } from "inversify";
import { Server as SocketIOServer, Socket } from "socket.io";

import { MessageType, ROLE, SenderRole } from "@/constants";
import { IChatSocketController } from "@/core/interfaces/controllers/IChatSocketController";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { IPresenceService } from "@/core/interfaces/services/IPresenceService";
import { TYPES } from "@/di/types";
import { getIO } from "@/socket/socket";
import { IChat } from "@/types/chat/chat.entity";

interface SendMessagePayload {
  chatId: string;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  replyToMessageId?: string;
  tempId?: string;
}

interface JoinChatPayload {
  chatId: string;
}

interface MessageSeenPayload {
  chatId: string;
}

@injectable()
export class ChatSocketController implements IChatSocketController {
  constructor(
    @inject(TYPES.MessageService) private _messageService: IMessageService,
    @inject(TYPES.ChatService) private _chatService: IChatService,
    @inject(TYPES.PresenceService) private _presenceService: IPresenceService
  ) {}

  registerHandlers(
    io: SocketIOServer,
    socket: Socket,
    participantId: string,
    role: SenderRole
  ): void {
    socket.on("joinChat", (payload: JoinChatPayload) => {
      void this.handleJoinChat(io, socket, payload, participantId, role);
    });

    socket.on("sendMessage", (payload: SendMessagePayload) => {
      void this.handleSendMessage(io, socket, payload, participantId, role);
    });

    socket.on("messageSeen", (payload: MessageSeenPayload) => {
      void this.handleMessageSeen(io, payload, participantId, role);
    });

    socket.on("deleteMessage", (payload: { messageId: string; chatId: string }) => {
      void this.handleDeleteMessage(io, socket, payload, participantId, role);
    });

    socket.on("editMessage", (payload: { messageId: string; chatId: string; content: string }) => {
      void this.handleEditMessage(io, socket, payload, participantId, role);
    });

    socket.on("toggleChatStatus", (payload: { chatId: string }) => {
      void this.handleToggleChatStatus(io, socket, payload, participantId, role);
    });
  }

  private async handleJoinChat(
    io: SocketIOServer,
    socket: Socket,
    payload: JoinChatPayload,
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { chatId } = payload;
      await this._chatService.authorizeChat({ chatId, participantId, role });
      socket.join(chatId);

      const updatedCount = await this._messageService.markRoomMessagesAsDelivered(chatId, role);
      if (updatedCount > 0) {
        io.to(chatId).emit("messageStatusUpdate", {
          chatId,
          status: "delivered",
          role,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not join chat";
      socket.emit("error", { event: "joinChat", message });
    }
  }

  private async handleSendMessage(
    io: SocketIOServer,
    socket: Socket,
    payload: SendMessagePayload,
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { chatId, type, content, mediaUrl, replyToMessageId, tempId } = payload;

      const chat = await this._chatService.authorizeChat({ chatId, participantId, role });
      if (chat.isBlocked) {
        socket.emit("error", { event: "sendMessage", message: "Chat is blocked" });
        return;
      }

      let savedMsg = await this._messageService.saveMessage({
        chatId,
        senderId: participantId,
        role,
        type,
        content,
        mediaUrl,
        replyToMessageId,
      });

      const recipientId = role === ROLE.WORKER ? chat.userId.toString() : chat.workerId.toString();
      const recipientIsOnline = await this._presenceService.isOnline(recipientId);

      if (recipientIsOnline) {
        const recipientRole: SenderRole = role === ROLE.WORKER ? ROLE.USER : ROLE.WORKER;
        const updatedMsg = await this._messageService.markMessageAsDelivered(
          savedMsg.id,
          recipientRole
        );
        if (updatedMsg) {
          savedMsg = updatedMsg;
        }
        io.to(chatId).emit("messageStatusUpdate", {
          chatId,
          messageIds: [savedMsg.id],
          status: "delivered",
          role: recipientRole,
        });
      }

      await this._messageService.notifyNewMessage({
        chatId,
        participantIds: { userId: chat.userId.toString(), workerId: chat.workerId.toString() },
        senderRole: role,
        savedMsg,
        tempId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send message";
      socket.emit("error", { event: "sendMessage", message });
    }
  }

  private async handleMessageSeen(
    io: SocketIOServer,
    payload: MessageSeenPayload,
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { chatId } = payload;
      await this._chatService.authorizeChat({ chatId, participantId, role });

      await this._messageService.markRoomMessagesAsRead(chatId, role);

      io.to(chatId).emit("messageStatusUpdate", {
        chatId,
        status: "seen",
        role,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      console.error(`messageSeen failed for ${participantId} on chat ${payload.chatId}`, message);
    }
  }

  private async handleDeleteMessage(
    io: SocketIOServer,
    socket: Socket,
    payload: { messageId: string; chatId: string },
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { messageId, chatId } = payload;
      const chat = await this._chatService.authorizeChat({ chatId, participantId, role });
      await this._messageService.deleteMessage({
        messageId,
        chatId,
        lastMessageId: chat.lastMessage?.messageId?.toString(),
      });

      const lastMessage = chat.lastMessage
        ? {
            messageId: chat.lastMessage.messageId.toString(),
            type: chat.lastMessage.type,
            role: chat.lastMessage.role,
            content: chat.lastMessage.content,
            createdAt: chat.lastMessage.createdAt,
            isDeleted: chat.lastMessage.isDeleted,
          }
        : undefined;

      io.to(chatId).emit("messageDeleted", { messageId, chatId });

      const chatUpdatedPayload = {
        chatId,
        lastMessage,
      };
      io.to(chat.userId.toString()).emit("chatUpdated", chatUpdatedPayload);
      io.to(chat.workerId.toString()).emit("chatUpdated", chatUpdatedPayload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete message";
      socket.emit("error", { event: "deleteMessage", message });
    }
  }

  private async handleEditMessage(
    io: SocketIOServer,
    socket: Socket,
    payload: { messageId: string; chatId: string; content: string },
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { messageId, chatId, content } = payload;
      const chat = await this._chatService.authorizeChat({ chatId, participantId, role });
      await this._messageService.editMessage({ messageId, chatId, role, content });

      io.to(chatId).emit("messageEdited", { chatId, messageId, content, isEdited: true });

      const lastMessage = chat.lastMessage
        ? {
            messageId: chat.lastMessage.messageId.toString(),
            type: chat.lastMessage.type,
            role: chat.lastMessage.role,
            content: chat.lastMessage.content,
            createdAt: chat.lastMessage.createdAt,
            isDeleted: chat.lastMessage.isDeleted,
          }
        : undefined;

      const chatUpdatedPayload = { chatId, lastMessage };
      io.to(chat.userId.toString()).emit("chatUpdated", chatUpdatedPayload);
      io.to(chat.workerId.toString()).emit("chatUpdated", chatUpdatedPayload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not edit message";
      socket.emit("error", { event: "editMessage", message });
    }
  }

  private async handleToggleChatStatus(
    io: SocketIOServer,
    socket: Socket,
    payload: { chatId: string },
    participantId: string,
    role: SenderRole
  ): Promise<void> {
    try {
      const { chatId } = payload;
      const chat = await this._chatService.toggleChatStatus({ chatId, participantId, role });

      const event = chat.isBlocked ? "chatBlocked" : "chatUnblocked";
      io.to(chatId).emit(event, { chatId, isBlocked: chat.isBlocked, blockedBy: chat.blockedBy });

      const chatUpdatedPayload = {
        chatId,
        isBlocked: chat.isBlocked,
        blockedBy: chat.blockedBy,
      };
      io.to(chat.userId.toString()).emit("chatUpdated", chatUpdatedPayload);
      io.to(chat.workerId.toString()).emit("chatUpdated", chatUpdatedPayload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not toggle chat status";
      socket.emit("error", { event: "toggleChatStatus", message });
    }
  }

  broadcastMessageDeleted(
    chatId: string,
    messageId: string,
    updatedLastMessage?: IChat["lastMessage"]
  ): void {
    const io = getIO();
    io.to(chatId).emit("messageDeleted", { chatId, messageId });
    if (updatedLastMessage) {
      io.to(chatId).emit("chatUpdated", { chatId, lastMessage: updatedLastMessage });
    }
  }

  broadcastMessageEdited(chatId: string, messageId: string, content: string): void {
    const io = getIO();
    io.to(chatId).emit("messageEdited", { chatId, messageId, content, isEdited: true });
    io.to(chatId).emit("chatUpdated", {
      chatId,
      lastMessage: { messageId, content },
    });
  }

  broadcastChatBlockToggled(
    chatId: string,
    isBlocked: boolean,
    blockedBy: SenderRole | null
  ): void {
    const io = getIO();
    const event = isBlocked ? "chatBlocked" : "chatUnblocked";
    io.to(chatId).emit(event, { chatId, isBlocked, blockedBy });
  }
}
