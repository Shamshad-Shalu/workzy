import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

@injectable()
export class ServiceController implements IServiceController {
  createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
