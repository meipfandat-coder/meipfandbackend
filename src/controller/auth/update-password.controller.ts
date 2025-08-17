import { Response, Request } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { validateData } from "../../lib/validateData.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { User } from "../../models/user.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { cookieOptions } from "../../lib/cookieOptions.js";

interface UpdatePasswordProps {
  forgotToken: string;
  password: string;
}

export const UpdatePasswordController = asyncHandler(async (req: Request, res: Response) => {
  validateData(req.body, ["forgotToken", "password"]);
  const { forgotToken, password } = req.body as UpdatePasswordProps;
    
  let decoded;
      try {
        decoded = jwt.verify(forgotToken, config.ForgotTokenSecret) as {
          _id: string | undefined;
        };
      } catch (err) {
        throw new ErrorResponse(403, "Invalid or expired refresh token");
      }
      
  if (!decoded._id) {
    throw new ErrorResponse(403, "Invalid Token");
  }
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ErrorResponse(404, "User not exist");
  }
  user.password = password;
  user.forgotToken = null;

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await user.save();

  const returnUser = await User.findById(user._id).select(
    "-password -forgotToken -_id -__v"
  );
  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIResponse(201, "Password updated successfully", {
        ...returnUser.toObject(),
        accessToken,
      })
    );
});
