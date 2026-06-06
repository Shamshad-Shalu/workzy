import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { AUTH, BOOKING, CHAT, HTTPSTATUS, ROLE, SenderRole } from "@/constants";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IChatRepository } from "@/core/interfaces/repositories/IChatRepository";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { ChatResponseDTO, ChatRoomListItem } from "@/dtos/responses/chat.dto";
import { ChatListItem } from "@/types/chat/chat.projection";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";
import CustomError from "@/utils/customError";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) private _chatRepository: IChatRepository,
    @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository,
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async createChatRoom(
    bookingId: string,
    creatorId: string,
    role: SenderRole
  ): Promise<ChatResponseDTO> {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new CustomError(BOOKING.INVALID_BOOKING_ID);
    }
    const existing = await this._chatRepository.findByBookingId(bookingId);
    if (existing) {
      return await ChatResponseDTO.fromEntity({ chat: existing }, this._s3Service);
    }
    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new CustomError(BOOKING.NOT_FOUND);
    }
    const userId = booking.userId.toString();
    const workerId = booking.workerId.toString();
    if (
      (role === ROLE.WORKER && creatorId !== workerId) ||
      (role === ROLE.USER && creatorId !== userId)
    ) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    const chat = await this._chatRepository.create({
      bookingId: new Types.ObjectId(bookingId),
      userId: new Types.ObjectId(userId),
      workerId: new Types.ObjectId(workerId),
      searchText: `${booking.bookingId} - ${booking.snapshot.category.name}`,
      isActive: true,
      lastMessage: undefined,
    });

    const [chatResponse] = await Promise.all([
      this._chatRepository.findByChatId(chat._id),
      this._bookingRepository.findByIdAndUpdate(bookingId, { chatId: chat._id.toString() }),
    ]);
    if (!chatResponse) {
      throw new CustomError(CHAT.NOT_FOUND);
    }
    return await ChatResponseDTO.fromEntity({ chat: chatResponse }, this._s3Service);
  }

  async getChatRoomById(data: {
    chatId: string;
    participantId: string;
    role: SenderRole;
  }): Promise<ChatResponseDTO> {
    const { chatId, participantId, role } = data;
    const chat = await this._chatRepository.findByChatId(chatId);
    if (!chat) {
      throw new CustomError(CHAT.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    this.authorizeChatAccess({ participantId, role, chat });
    return await ChatResponseDTO.fromEntity({ chat }, this._s3Service);
  }

  async getChatRooms(input: ChatQuery): Promise<CursorPaginatedResult<ChatResponseDTO>> {
    const { data, nextCursor } = await this._chatRepository.getChatRooms(input);

    if (data.length === 0) {
      return { data: [], nextCursor };
    }
    const chatIds = data.map((chat) => chat._id.toString());

    const unreadCounts = await this._messageRepository.getUnreadCounts(chatIds, input.role);
    const unreadCountMap = new Map(unreadCounts.map((item) => [item._id.toString(), item.count]));

    const chatRooms: ChatRoomListItem[] = data.map((chat) => ({
      chat,
      unread: unreadCountMap.get(chat._id.toString()) ?? 0,
    }));

    return {
      data: await ChatResponseDTO.fromEntities(chatRooms, this._s3Service),
      nextCursor,
    };
  }

  private authorizeChatAccess(data: {
    chat: ChatListItem;
    participantId: string;
    role: string;
  }): void {
    const { participantId, role, chat } = data;
    if (role === ROLE.ADMIN) {
      return;
    }
    if (
      (role === ROLE.WORKER && participantId !== chat.workerId._id.toString()) ||
      (role === ROLE.USER && participantId !== chat.userId._id.toString())
    ) {
      throw new CustomError(CHAT.UNAUTHORIZED, HTTPSTATUS.FORBIDDEN);
    }
  }

  async disableChatRoom(chatId: string): Promise<void> {
    const chat = await this._chatRepository.findOneAndUpdate(
      { _id: chatId, isActive: true },
      { isActive: false }
    );

    if (!chat) {
      throw new CustomError(CHAT.UNABLE_TO_DISABLE);
    }
  }
}
