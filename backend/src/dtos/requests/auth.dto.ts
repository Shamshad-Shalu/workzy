import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export class RegisterRequestDTO {
  @IsString()
  @Matches(/^[A-Za-z]{3,25}$/, {
    message: "Name must be 3–25 characters long and contain only letters",
  })
  name!: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      "Password must be at least 8 characters with uppercase, lowercase, number & special char",
  })
  password!: string;
}
