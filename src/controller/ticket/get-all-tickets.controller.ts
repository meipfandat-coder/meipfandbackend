import { Request ,Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Point } from "../../models/point.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { Ticket } from "../../models/ticket.model.js";

export const GetTicketsController = asyncHandler(async(req: Request, res: Response)=>{
    const currentUserRole = (req as any).user.role;
   if (currentUserRole === "collector") {
       throw new ErrorResponse(403, "Collector is not allow to get tickets");
     }

     let tickets = currentUserRole === 'admin' ? await Ticket.find() : await Ticket.find({available:true})

     res.status(200).json(new APIResponse(200,'tickets get successfully',tickets))
})