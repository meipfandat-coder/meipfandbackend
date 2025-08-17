import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { validateData } from "../../lib/validateData.js";
import { User } from "../../models/user.model.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { sendEmail } from "../../lib/sendEmail.js";
import { ForgotPasswordEmailTemplate } from "../../lib/emailTemplates/forgotPasswordEmail.js";

interface ForgotProps {
  email: string;
  redirect_url: string;
}

export const ForgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    validateData(req.body, ["email", "redirect_url"]);
    const { email, redirect_url } = req.body as ForgotProps;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorResponse(403, "User not exist");
    }
    const forgotToken = user.generateForgotToken();
    await user.save();
    const redirectURL = `${redirect_url}?token=${forgotToken}`;

    await sendEmail(ForgotPasswordEmailTemplate({ email, redirectURL }));

    res.status(200).json(
      new APIResponse(200, "Forgot email sended successfully", {
        forgotToken,
      })
    );
  }
);
