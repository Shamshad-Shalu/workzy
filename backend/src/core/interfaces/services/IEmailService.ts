import { RegisterRequestDTO } from "@/dtos/requests/auth.dto";

export interface IEmailService {
  sendOtpEmail(userData: RegisterRequestDTO, otp: string): Promise<void>;
  sendResetEmail(email: string, resetLink: string, expiryTime: number): Promise<void>;
  sendResetEmailWithToken(email: string): Promise<void>;
  sendEmail(email: string, otp: string): Promise<void>;
}
