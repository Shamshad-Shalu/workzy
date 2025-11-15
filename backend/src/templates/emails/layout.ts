export function emailLayout(content: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      
      <!-- Header -->
      <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Workzy</h1>
      </div>

      <!-- Dynamic Content -->
      <div style="padding: 20px; color: #333333;">
          ${content}
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; font-size: 14px; color: #777777; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">Best regards,<br>The Workzy Team</p>
          <p style="margin: 10px 0 0;"><a href="https://www.workzy.com" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
          <p style="margin: 10px 0 0; font-size: 12px;">© ${new Date().getFullYear()} Workzy. All rights reserved.</p>
      </div>

    </div>
  `;
}
