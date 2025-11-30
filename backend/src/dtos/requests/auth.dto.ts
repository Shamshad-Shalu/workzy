import { NameRule, PasswordRule } from "@/validations/rules";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class RegisterRequestDTO {
  @IsString()
  @NameRule()
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString()
  @PasswordRule()
  password!: string;
}

export class LoginRequestDTO {
  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
