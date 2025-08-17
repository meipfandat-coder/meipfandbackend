import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { User } from "../../models/user.model.js";
import { cookieOptions } from "../../lib/cookieOptions.js";
import { APIResponse } from "../../lib/apiResponse.js";

export const RefreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies.refreshToken ||
      req.headers["www-authenticate"]?.split(" ")[1];
    if (!refreshToken) {
      throw new ErrorResponse(403, "you are not authorized");
    }
    
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.RefreshTokenSecret) as {
        _id: string | undefined;
      };
    } catch (err) {
      throw new ErrorResponse(403, "Invalid or expired refresh token");
    }

    if (!decoded._id) {
      throw new ErrorResponse(403, "Invalid token");
    }

    const user = await User.findById(decoded._id).select(
      "-password -__v -forgotToken"
    );

    if (!user) {
      throw new ErrorResponse(403, "User not found");
    }

    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      throw new ErrorResponse(403, "user not logged in");
    }

    const accessToken = user.generateAccessToken();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new APIResponse(200, "Access token generated successfully", {
          ...user.toObject(),
          accessToken,
        })
      );
  }
);
