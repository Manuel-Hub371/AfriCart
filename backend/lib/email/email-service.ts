/**
 * Transactional Email Abstraction Service for AfriCart
 * Supports Resend, SendGrid, or Console Log fallback in Development
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  async sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;

    if (process.env.NODE_ENV === "production" && apiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "AfriCart Support <noreply@africart.com>",
            to,
            subject,
            html,
            text: text || subject,
          }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error("Transactional email dispatch failed:", errBody);
          return false;
        }

        return true;
      } catch (err) {
        console.error("Error sending transactional email:", err);
        return false;
      }
    }

    // Development fallback
    console.log("================ [EMAIL DISPATCH DEV LOG] ================");
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`HTML BODY:\n${html}`);
    console.log("==========================================================");
    return true;
  },

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
        <h2 style="color: #059669;">AfriCart Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your password for your AfriCart account. Click the button below to reset your password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Reset your AfriCart password",
      html,
    });
  },

  async sendEmailVerificationEmail(email: string, verificationToken: string, firstName: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/auth/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 12px;">
        <h2 style="color: #059669;">Verify your AfriCart Email</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for registering on AfriCart! Please click the button below to verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Verify your AfriCart email address",
      html,
    });
  },
};
