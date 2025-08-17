import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { validateData } from "../../lib/validateData.js";
import { User } from "../../models/user.model.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { cookieOptions } from "../../lib/cookieOptions.js";

interface LoginProps {
  email: string;
  password: string;
}

export const LoginUserController = asyncHandler(async (req: Request, res: Response) => {
  validateData(req.body, ["email", "password"]);
  const { email, password } = req.body as LoginProps;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse(401, "user not found");
  }

  if (!user.comparePassword(password)) {
    throw new ErrorResponse(401, "Invalid Credentials");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save();
  const returnUser = await User.findById(user._id).select(
    "-password -_id -__v"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new APIResponse(200, "user login successfully", {...returnUser.toObject(), accessToken}));
});
