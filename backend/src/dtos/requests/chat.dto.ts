import { IsString, IsEnum, IsMongoId, MinLength, MaxLength, ValidateIf } from "class-validator";

import { MESSAGE_TYPE, MESSAGE_TYPE_VALUES } from "@/constants/chat";

export class SendMessageDTO {
  @IsMongoId()
  bookingId!: string;

  @IsEnum(MESSAGE_TYPE_VALUES)
  type!: string;

  @ValidateIf((o) => o.type === MESSAGE_TYPE.TEXT)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content?: string;

  @ValidateIf((o) => o.type !== MESSAGE_TYPE.TEXT)
  @IsString()
  @MinLength(1)
  mediaUrl?: string;
}

export class MarkAsReadDTO {
  @IsMongoId()
  bookingId!: string;

  @IsMongoId()
  messageId!: string;
}
