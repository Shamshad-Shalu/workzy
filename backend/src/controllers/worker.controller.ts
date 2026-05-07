import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, WORKER } from "@/constants";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDto } from "@/dtos/requests/worker.profile.dto";
import CustomError from "@/utils/customError";

@injectable()
export class WorkerController implements IWorkerController {
  constructor(@inject(TYPES.WorkerService) private _workerService: IWorkerService) {}

  getWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const worker = await this._workerService.getWorkerProfile(workerId);
    res.status(HTTPSTATUS.OK).json({ worker });
  });

  listPublicWorkers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { serviceId } = req.params;
    const workerId = req.user?.workerId;
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    const radiusKm = Number(req.query.radiusKm ?? 150);
    const limit = Math.max(Number(req.query.limit ?? 5), 5);

    if (isNaN(lat) || isNaN(lng)) {
      throw new CustomError("lat and lng query parameters are required", HTTPSTATUS.BAD_REQUEST);
    }
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    const { data, nextCursor } = await this._workerService.listPublicWorkers(serviceId, {
      lat,
      lng,
      radiusKm,
      limit: Math.min(limit, 10),
      workerId: workerId,
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      availableNow: req.query.availableNow === "true",
      cursor: parsedCursor
        ? {
            _id: parsedCursor._id,
            distance: parsedCursor.distance,
          }
        : undefined,
    });

    res.status(HTTPSTATUS.OK).json({ workers: data, nextCursor });
  });

  getWorkerProfileDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const workerData = await this._workerService.getWorkerProfileDetails(workerId);
    res.status(HTTPSTATUS.OK).json(workerData);
  });
  getWorkerProfileDetailsById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const workerData = await this._workerService.getWorkerProfileDetails(workerId);
    console.log("hello::", workerData);
    res.status(HTTPSTATUS.OK).json(workerData);
  });

  updateWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const data = req.body as WorkerProfileRequestDto;
    const workerData = await this._workerService.updateWorkerProfile(workerId, data);
    res.status(HTTPSTATUS.OK).json({ message: WORKER.UPDATE_SUCCESS, workerData });
  });

  updateWorkerPhone = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { phone } = req.body;

    await this._workerService.updateWorkerPhone(workerId, phone);
    res.status(HTTPSTATUS.OK).json({ message: WORKER.UPDATE_SUCCESS });
  });

  updateProfileImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { url } = req.body;
    if (!workerId || !url) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const imageUrl = await this._workerService.updateProfileImage(workerId, url);
    res.status(HTTPSTATUS.OK).json({ url: imageUrl });
  });

  createWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const data = req.body as JoinUsDTO;

    const worker = await this._workerService.createWorkerProfile(userId, data);
    res.status(200).json({ message: WORKER.CREATE_SUCCES, worker });
  });

  reSubmitWorkerDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const data = req.body as ResubmitDocument;
    const workerData = await this._workerService.reSubmitWorkerDocument(workerId, data);
    res.status(200).json({ message: WORKER.DOCUMENT_UPDATED, worker: workerData });
  });
  connectStripe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const url = await this._workerService.connectStripe(workerId);
    res.status(HTTPSTATUS.OK).json({ url });
  });

  getStripeStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { status, stripeAccountId } = await this._workerService.getStripeStatus(workerId);
    res.status(HTTPSTATUS.OK).json({ status, stripeAccountId });
  });

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }
}
