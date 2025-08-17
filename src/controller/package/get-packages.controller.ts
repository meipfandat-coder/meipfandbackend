import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";

export const GetPackagesController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role === "donor") {
    throw new ErrorResponse(403, "Donor is not allowed");
  }

  const packages = user.role === 'admin' ? await Package.find() : await Package.find({available:true});
  res.status(200).json(new APIResponse(200, "All Packages get successfully", packages));
});
