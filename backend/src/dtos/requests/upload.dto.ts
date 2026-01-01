import { UploadFolders } from "@/constants";
import { IsString, IsEnum, IsOptional } from "class-validator";

export class RequestUploadUrlDTO {
  @IsString() fileName!: string;
  @IsString() fileType!: string;
  @IsEnum(UploadFolders) folder!: string;
  @IsOptional() @IsString() prefix?: string;
}
