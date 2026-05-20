import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export class ResolveDisputeDTO {
  @IsEnum(["approve", "refund"])
  resolution!: "approve" | "refund";

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  adminNote!: string;
}

export class AdminCancelDTO {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  reason!: string;
}

export class AdminNoteDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  note!: string;
}
