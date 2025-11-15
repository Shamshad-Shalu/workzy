import { emailLayout } from "./layout";

export function resetPasswordTemplate(resetLink: string) {
  const content = `
      <h2>Password Reset Request</h2>
      <p>Click the button below to reset your password:</p>

      <a href="${resetLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff;
                border-radius: 4px; text-decoration: none; margin: 20px 0;">
         Reset Password
      </a>

      <p>This link is valid for <strong>15 minutes</strong>.</p>
  `;

  return emailLayout(content);
}
