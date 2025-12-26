import { DESCRIPTION_REGEX, WORKER_STATUS, WORKER_STATUSES } from "@/constants";
import { IsEnum, IsString, Matches, MinLength, ValidateIf } from "class-validator";

export class VerifyWorkerRequestDTO {
  @ValidateIf((o) => o.status === "verified")
  @IsString()
  @Matches(/^(?=(?:.*[A-Za-z]){3,})[A-Za-z0-9\s#\-\/.,]{3,50}$/, {
    message: "Name must be 3–50 characters and valid",
  })
  docName?: string;

  @ValidateIf((o) => o.status === "needs_revision" || o.status === "rejected")
  @IsString()
  @MinLength(10, { message: "Reason minimum 10 characters" })
  @Matches(DESCRIPTION_REGEX, {
    message: "Note contains required invalid characters",
  })
  reason?: string;

  @IsEnum(WORKER_STATUS, {
    message: "status is required",
  })
  status!: WORKER_STATUSES;

  @IsString()
  @MinLength(1, { message: "docId is required" })
  docId!: string;
}
