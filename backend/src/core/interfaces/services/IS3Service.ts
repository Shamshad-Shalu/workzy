import { RequestUploadUrlDTO } from "@/dtos/requests/upload.dto";

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

export interface IS3Service {
  generateUploadPresignedUrl(data: RequestUploadUrlDTO): Promise<UploadUrlResponse>;
  generateSignedUrl(fileUrl: string, expiresIn?: number): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}
