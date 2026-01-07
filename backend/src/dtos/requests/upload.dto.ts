import { UploadPurpose, UploadPurposes } from "@/constants";
import { IsString, IsEnum, IsNumber } from "class-validator";

export class RequestUploadUrlDTO {
  @IsString() fileName!: string;
  @IsString() fileType!: string;
  @IsNumber() fileSize!: number;
  @IsEnum(UploadPurposes) purpose!: UploadPurpose;
}
