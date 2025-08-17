import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { User } from "../../models/user.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

interface ProfileUpdateProps {
  firstName: string;
  lastName: string;
}

export const GetProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
      throw new ErrorResponse(403, "you are not authorized");
    }

    const returnUser = await User.findById(user._id).select(
      "-password -__v -forgotToken"
    );

    res
      .status(200)
      .json(
        new APIResponse(200, "Profile data fetched successfully", returnUser)
      );
  }
);

export const UpdateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    validateData(req.body, ["firstName", "lastName"]);
    const user = (req as any).user;
    const { firstName, lastName } = req.body as ProfileUpdateProps;

    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();
    
    const returnUser = await User.findById(user._id).select('-forgotToken -refreshToken -password -_id -__v')

    res
      .status(201)
      .json(new APIResponse(201, "Profile Data Updated Successfully",returnUser));
  }
);
