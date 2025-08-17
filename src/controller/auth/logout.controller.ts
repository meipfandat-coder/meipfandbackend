import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { ErrorResponse } from "../../lib/errorResponse.js";

export const LogoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
      throw new ErrorResponse(403, "you are not authorized");
    }
    user.refreshToken = null;
    await user.save();
    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new APIResponse(200, "logout successfully"));
  }
);
