import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS } from "@/constants";
import { IUploadController } from "@/core/interfaces/controllers/IUploadController";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { RequestUploadUrlDTO } from "@/dtos/requests/upload.dto";
import { ApiResponse } from "@/utils/apiResponse";

@injectable()
export class UploadController implements IUploadController {
  constructor(@inject(TYPES.S3Service) private _s3Service: IS3Service) {}

  requestUploadUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body as RequestUploadUrlDTO;

    const signedUrl = await this._s3Service.generateUploadPresignedUrl(data);

    res.status(HTTPSTATUS.OK).json(new ApiResponse(signedUrl));
  });
}
