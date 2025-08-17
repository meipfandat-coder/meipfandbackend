import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { BuyTicket } from "../../models/ticket.model.js";
import { validateData } from "../../lib/validateData.js";

export const UpdateWinnerStatusController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can update winner status");
  }
  validateData(req.body, ['id','winner'])
  const { id, winner, description } = req.body;
  
  if (!id || typeof winner !== "boolean") {
    throw new ErrorResponse(400, "buyTicketId and winner status are required");
  }

  const updated = await BuyTicket.findByIdAndUpdate(id, { winner, description }, { new: true });

  if (!updated) {
    throw new ErrorResponse(404, "BuyTicket entry not found");
  }

  res.status(201).json(new APIResponse(201, "Winner status updated", updated));
});
