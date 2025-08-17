interface ForgotPasswordEmailProps {
  email: string;
  redirectURL: string;
}

export function ForgotPasswordEmailTemplate({
  email,
  redirectURL,
}: ForgotPasswordEmailProps) {
  return {
    from: "register@meipfand.at",
    to: [email, "register@meipfand.at", "devbymoaz@gmail.com"],
    subject: "Reset Your Password - Bottle Recycling Platform",
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f6fff7; color: #2e7d32; border: 1px solid #c8e6c9; border-radius: 8px;">
        <h2 style="text-align: center; color: #388e3c;">Reset Your Password</h2>
        <p>We received a request to reset the password for your account.</p>
        <p>Please click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${redirectURL}" style="padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also click or paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${redirectURL}" style="color: #2e7d32;">${redirectURL}</a></p>
        <p style="margin-top: 30px;">♻️ Stay secure and keep recycling!</p>
        <hr style="border: none; border-top: 1px solid #c8e6c9;">
        <p style="font-size: 12px; color: #777;">If you didn’t request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };
}
