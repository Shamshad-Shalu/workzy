import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, WORKER } from "@/constants";
import { IWorkerController } from "@/core/interfaces/controllers/IWorkerController";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { JoinUsDTO, ResubmitDocument } from "@/dtos/requests/joinUs.dto";
import { WorkerProfileRequestDTO } from "@/dtos/requests/worker.profile.dto";
import CustomError from "@/utils/customError";

@injectable()
export class WorkerController implements IWorkerController {
  constructor(@inject(TYPES.WorkerService) private _workerService: IWorkerService) {}

  getWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const workerProfileDetails = await this._workerService.getWorkerProfile(workerId);
    res.status(200).json(workerProfileDetails);
  });

  getWorkerSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const workerSummary = await this._workerService.getWorkerSummary(workerId);
    res.status(200).json(workerSummary);
  });

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError(AUTH.INVALID_TOKEN);
    }
    const worker = await this._workerService.getWorkerByUserId(userId);
    if (!worker) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.BAD_REQUEST);
    }
    const workerData = await this._workerService.getWorkerProfile(worker?._id?.toString());
    res.status(200).json(workerData);
  });

  updateWorkerProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.params.workerId;
    const data = req.body as WorkerProfileRequestDTO;
    const workerData = await this._workerService.updateWorkerProfile(workerId, data);
    res.status(200).json({ message: WORKER.UPDATE_SUCCESS, workerData });
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

  listWorkers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { serviceId } = req.params;
    const { total, workers } = await this._workerService.listWorkers(serviceId, {
      lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
      lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
      radiusKm: req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      availableNow: req.query.availableNow === "true",
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    });

    res.status(HTTPSTATUS.OK).json({ total, workers });
  });
  connectStripe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    const url = await this._workerService.connectStripe(workerId);
    res.status(HTTPSTATUS.OK).json({ url });
  });

  getStripeStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    const { status, stripeAccountId } = await this._workerService.getStripeStatus(workerId);
    res.status(HTTPSTATUS.OK).json({ status, stripeAccountId });
  });
}
