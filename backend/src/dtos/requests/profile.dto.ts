import { PasswordRule } from "@/validations/rules";
import { IsString } from "class-validator";

export class ChangePasswordDTO {
  @IsString()
  currentPassword!: string;

  @IsString()
  @PasswordRule()
  newPassword!: string;
}
