import { Request ,Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Point } from "../../models/point.model.js";
import { APIResponse } from "../../lib/apiResponse.js";

export const GetPointsController = asyncHandler(async(req: Request, res: Response)=>{
   if ((req as any).user.role !== "donor") {
       throw new ErrorResponse(403, "Only Donor is allow to get points");
     }

     let points = await Point.findOne({fk_user_id:(req as any).user._id})
     if (!points) {
      points = new Point({
      current_points: 0,
      total_points: 0,
      fk_user_id: (req as any).user._id,
     });
     await points.save();
     }

     res.status(200).json(new APIResponse(200,'points get successfully',points.toObject()))
})