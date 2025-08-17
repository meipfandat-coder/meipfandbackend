import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";
import { PreRegisterUser, User } from "../../models/user.model.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateRole } from "../../lib/validateRole.js";
import { sendEmail } from "../../lib/sendEmail.js";
import { RegisterEmailTemplate } from "../../lib/emailTemplates/registerEmail.js";

interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | undefined;
  password: string;
  role: string;
  redirect_url: string;
}

export const RegisterUserController = asyncHandler(
  async (req: Request, res: Response) => {
    validateData(req.body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "redirect_url",
    ]);
    validateRole(req.body?.role);
    const body = req.body as RegisterProps;
    const { email, redirect_url } = body;
    const lowerEmail = email.toLocaleLowerCase();
    const user = await User.find({ email: lowerEmail });
    console.log("user : ", user);
    if (user[0]) {
      throw new ErrorResponse(400, "User already exist");
    }

    const newUser = await PreRegisterUser.create({
      ...body,
      email: lowerEmail,
    });
    const { email: userEmail, verifyToken } = newUser;
    const redirectURL = `${redirect_url}?token=${verifyToken}`;

    await sendEmail(RegisterEmailTemplate({...req.body, redirectURL}))

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          "User Created, Verification Email sended to your email",
          { email: userEmail }
        )
      );
  }
);
