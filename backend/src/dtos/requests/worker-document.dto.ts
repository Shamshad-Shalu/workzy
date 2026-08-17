import { IsEnum, IsString } from "class-validator";

import { DOCUMENT_TYPE, DocumentType } from "@/constants";

export class WorkerDocumentUploadDTO {
  @IsEnum(DOCUMENT_TYPE, { message: "Invalid document type" })
  type!: DocumentType;

  @IsString({ message: "Document URL is required" })
  url!: string;
}

export class WorkerDocumentUpdateDTO {
  @IsString({ message: "Document URL is required" })
  url!: string;
}
