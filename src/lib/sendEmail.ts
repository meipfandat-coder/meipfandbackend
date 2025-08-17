import nodemailer from "nodemailer";
import { emailConfig } from "./emailConfig.js";
import { ErrorResponse } from "./errorResponse.js";

interface mailOptionsProps {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail(mailOptions: mailOptionsProps) {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("send mail error : ", error);
    throw new ErrorResponse(
      500,
      "Error occur in email service please try later"
    );
  }
}
