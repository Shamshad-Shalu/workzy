import { s3 } from "@/config/s3";
import { AWS_REGION, AWS_S3_BUCKET, AWS_S3_EXPIRY, PURPOSE_POLICY } from "@/constants";
import { IS3Service, UploadUrlResponse } from "@/core/interfaces/services/IS3Service";
import { RequestUploadUrlDTO } from "@/dtos/requests/upload.dto";
import CustomError from "@/utils/customError";
import {
  extractKeyFromUrl,
  generateUniqueFileName,
  getDefaultPrefix,
  getFileExtension,
} from "@/utils/upload";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { injectable } from "inversify";

interface S3Config {
  bucket: string;
  region: string;
  expiry: number;
}

@injectable()
export class S3Service implements IS3Service {
  private config: S3Config = {
    bucket: AWS_S3_BUCKET,
    region: AWS_REGION,
    expiry: AWS_S3_EXPIRY,
  };

  private s3: S3Client = s3;

  async generateUploadPresignedUrl(data: RequestUploadUrlDTO): Promise<UploadUrlResponse> {
    const { fileName, fileType, purpose, fileSize } = data;

    const policy = PURPOSE_POLICY[purpose];
    if (!policy) throw new CustomError("Invalid upload purpose");

    if (!(policy.allowedTypes as readonly string[]).includes(fileType)) {
      throw new CustomError("File type not allowed");
    }

    if (fileSize > policy.maxSizeMB * 1024 * 1024) {
      throw new Error("File too large");
    }

    const extension = getFileExtension(fileType, fileName);

    const prefix = getDefaultPrefix(policy.folder);
    const uniqueName = generateUniqueFileName(prefix, extension);
    const fileKey = `${policy.folder}/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    const url = `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${fileKey}`;

    const publicUrl = policy.folder.startsWith("private") ? await this.generateSignedUrl(url) : url;

    return { uploadUrl, publicUrl };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = extractKeyFromUrl(fileUrl);
    if (!key) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      })
    );
  }

  async generateSignedUrl(
    fileUrl: string,
    expiresIn: number = this.config.expiry
  ): Promise<string> {
    const key = extractKeyFromUrl(fileUrl);
    if (!key) return fileUrl;

    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn });
  }
}
