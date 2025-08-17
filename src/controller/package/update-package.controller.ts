import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const UpdatePackageController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can update packages");
  }
  
  validateData(req.body, ['name','description','amount','month','year','availability'])
  const {name, description, amount, month, year, availability} = req.body;

  const updated = await Package.findByIdAndUpdate(req.params.id, {name, description, amount, month, year, availability}, { new: true });

  if (!updated) {
    throw new ErrorResponse(404, "Package not found");
  }

  res.status(201).json(new APIResponse(201, "Package updated", updated));
});
