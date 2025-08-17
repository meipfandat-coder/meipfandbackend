import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const CreatePackageController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can create packages");
  }

  validateData(req.body, ["name", "amount", "month", "year"]);
  const {name, amount, month, year} = req.body;
  const created = await Package.create({name, amount, month, year});

  res.status(201).json(new APIResponse(201, "Package created", created));
});
