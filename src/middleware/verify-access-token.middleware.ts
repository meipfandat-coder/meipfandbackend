import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ErrorResponse } from "../lib/errorResponse.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const VerifyAccessTokenMiddleware = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const accessToken =
      req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      throw new ErrorResponse(401, "you are not authorized");
    }

    let decoded;
    try {
      
      decoded = jwt.verify(accessToken, config.AccessTokenSecret) as {
        _id: string | undefined;
      };

    } catch (err) {
      throw new ErrorResponse(401, "Invalid or expired refresh token");
    }

    if (!decoded._id) {
      throw new ErrorResponse(401, "Invalid authorized token");
    }

   const userWithCheckout = await User.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(decoded._id) } },

  {
    $project: {
      password: 0,
      __v: 0,
      forgotToken: 0 
    }
  },

  {
    $lookup: {
      from: "paymentcheckouts",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 }
      ],
      as: "paymentCheckout"
    }
  },
  {
    $addFields: {
      paymentCheckout: { $arrayElemAt: ["$paymentCheckout", 0] }
    }
  }
]);

const user = userWithCheckout[0];



    if (!user) {
      throw new ErrorResponse(401, "User not found");
    }

    if (!user.refreshToken) {
      throw new ErrorResponse(401, "you are not authorized");
    }

    (req as any).user = user; 


    next();
  }
);
