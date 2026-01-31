import { IsString, IsEnum, IsNumber } from "class-validator";

import { UploadPurpose, UploadPurposes } from "@/constants";

export class RequestUploadUrlDTO {
  @IsString() fileName!: string;
  @IsString() fileType!: string;
  @IsNumber() fileSize!: number;
  @IsEnum(UploadPurposes) purpose!: UploadPurpose;
}
