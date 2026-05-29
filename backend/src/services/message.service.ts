import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { ROLE } from "@/constants";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { ChatMessageResponseDTO, ChatMessageWithSender } from "@/dtos/responses/chat.dto";
import { MessageQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository) private _messageRepository: IMessageRepository,
    @inject(TYPES.WorkerRepository) private _workerRepository: IWorkerRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async getMessages(input: MessageQuery): Promise<CursorPaginatedResult<ChatMessageResponseDTO>> {
    const { data, nextCursor } = await this._messageRepository.getMessages(input);

    const workerIds = new Set<Types.ObjectId>();
    const userIds = new Set<Types.ObjectId>();

    for (const msg of data) {
      if (msg.role === ROLE.WORKER) {
        workerIds.add(msg.senderId);
      } else {
        userIds.add(msg.senderId);
      }
    }

    const [workers, users] = await Promise.all([
      workerIds.size > 0
        ? this._workerRepository.find({ _id: { $in: [...workerIds] } })
        : Promise.resolve([]),
      userIds.size > 0
        ? this._userRepository.find({ _id: { $in: [...userIds] } })
        : Promise.resolve([]),
    ]);

    const workerMap = new Map(workers.map((w) => [w._id.toString(), w]));
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const mapedData: ChatMessageWithSender[] = data.map((msg) => {
      const senderId = msg.senderId.toString();

      if (msg.role === ROLE.WORKER) {
        const worker = workerMap.get(senderId);
        return Object.assign(msg, {
          senderInfo: {
            name: worker?.displayName ?? "Unknown Worker",
            profileImage: worker?.profileImage,
          },
        });
      } else {
        const user = userMap.get(senderId);
        return Object.assign(msg, {
          senderInfo: {
            name: user?.name ?? "Unknown User",
            profileImage: user?.profileImage,
          },
        });
      }
    });

    return {
      data: await ChatMessageResponseDTO.fromEntities(mapedData, this._s3Service),
      nextCursor,
    };
  }
}
