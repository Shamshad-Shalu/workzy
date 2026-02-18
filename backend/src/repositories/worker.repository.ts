import { injectable } from "inversify";
import { FilterQuery, PipelineStage } from "mongoose";

import { ROLE, WORKER_STATUS } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import User from "@/models/user.model";
import Worker from "@/models/worker.model";
import { IWorker, NearbyWorkerEntity } from "@/types/worker";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
  constructor() {
    super(Worker);
  }

  async getAllWorkers(
    filter: FilterQuery<IWorker>,
    skip: number,
    limit: number
  ): Promise<IWorker[] | null> {
    const workers = await this.model
      .find(filter)
      .populate("userId", "name email phone isPremium isBlocked profileImage age")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return workers as unknown as IWorker[];
  }

  findNearbyWorkers(
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number
  ): Promise<NearbyWorkerEntity[]> {
    const maxDistance = radiusKm * 1000; // Convert km to meters

    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          key: "profile.location",
          distanceField: "distance",
          maxDistance: maxDistance,
          spherical: true,
          query: {
            role: ROLE.WORKER,
            isBlocked: false,
          },
        },
      },
      {
        $lookup: {
          from: "workers",
          localField: "_id",
          foreignField: "userId",
          as: "worker",
        },
      },
      {
        $unwind: "$worker",
      },
      {
        $match: { "worker.status": WORKER_STATUS.VERIFIED },
      },
      {
        $project: {
          _id: 1,
          profileImage: 1,
          distance: { $divide: ["$distance", 1000] },

          workerId: "$worker._id",
          displayName: "$worker.displayName",
          tagline: "$worker.tagline",
          experience: "$worker.experience",
        },
      },
      { $sort: { distance: 1 } },
      { $limit: limit },
    ];
    return User.aggregate<NearbyWorkerEntity>(pipeline).exec();
  }
}
