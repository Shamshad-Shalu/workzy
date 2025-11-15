import { emailLayout } from "./layout";

export function otpEmailTemplate(otp: string) {
  const content = `
      <h2>OTP Verification</h2>
      <p>Use the following OTP to continue:</p>

      <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; padding: 10px; background-color: #f0f8ff; border-radius: 4px;">
          ${otp}
      </div>

      <p>This OTP is valid for <strong>15 minutes</strong>.</p>
  `;

  return emailLayout(content);
}
