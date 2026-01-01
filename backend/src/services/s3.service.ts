import { s3 } from "@/config/s3";
import { AWS_REGION, AWS_S3_BUCKET, AWS_S3_EXPIRY } from "@/constants";
import { IS3Service, UploadUrlResponse } from "@/core/interfaces/services/IS3Service";
import { RequestUploadUrlDTO } from "@/dtos/requests/upload.dto";
import { generateUniqueFileName, getDefaultPrefix, getFileExtension } from "@/utils/upload";
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
    const { fileName, fileType, folder, prefix } = data;

    const prefixVal = prefix || getDefaultPrefix(folder);
    const extension = getFileExtension(fileType, fileName);
    const uniqueName = generateUniqueFileName(prefixVal, extension);
    const fileKey = `${folder}/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 300 });
    const publicUrl = `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${fileKey}`;

    return { uploadUrl, fileKey, publicUrl };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = this.extractKeyFromUrl(fileUrl);
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
    const key = this.extractKeyFromUrl(fileUrl);
    if (!key) return fileUrl;

    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, { expiresIn });
  }

  private extractKeyFromUrl(fileUrl: string): string | null {
    return fileUrl.split(".amazonaws.com/")[1] || null;
  }
}
