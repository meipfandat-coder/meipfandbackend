import { Response, Request } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { validateData } from "../../lib/validateData.js";
import jwt from "jsonwebtoken";
import { PreRegisterUser, User } from "../../models/user.model.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { config } from "../../config/config.js";
import { cookieOptions } from "../../lib/cookieOptions.js";

interface VerifyEmailProps {
  verifyToken: string;
}

export const VerifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    validateData(req.body, ["verifyToken"]);
    const { verifyToken } = req.body as VerifyEmailProps;

    let decoded;
    try {
      decoded = jwt.verify(verifyToken, config.VerifyTokenSecret) as {
        _id: string | undefined;
      };
    } catch (err) {
      throw new ErrorResponse(403, "Invalid or expired verification token");
    }

    if (!decoded?._id) {
      throw new ErrorResponse(400, "Invalid Email Verify Token");
    }

    const preUser = await PreRegisterUser.findById(decoded?._id);

    if (!preUser) {
      throw new ErrorResponse(400, "Invalid Email Verify Token");
    }
    console.log("preUser ", preUser);
    const alreadyUser = await User.findOne({ email: preUser.email });
    if (alreadyUser) {
      throw new ErrorResponse(400, "User already exist");
    }
    const verifyUser = await User.create(preUser.toObject());
    const accessToken = verifyUser.generateAccessToken();
    const refreshToken = verifyUser.generateRefreshToken();
    await verifyUser.save();
    const user = await User.findOne({ _id: verifyUser._id }).select(
      "-password -_id -__v"
    );
    console.log("user : ", user);
    if (!user) {
      throw new ErrorResponse(500, "Internal Server Error");
    }
    await PreRegisterUser.deleteMany({ email: user.email });

    res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new APIResponse(201, "User verified succuessfully", {
          ...user.toObject(),
          accessToken,
        })
      );
  }
);
