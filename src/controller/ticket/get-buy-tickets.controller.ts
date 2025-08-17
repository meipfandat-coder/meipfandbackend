import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { BuyTicket } from "../../models/ticket.model.js";

export const GetBuyTicketsController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role === "collector") {
    throw new ErrorResponse(403, "Collector is not allowed to access this route");
  }

  const query = user.role === "admin" ? {} : { fk_user_id: user._id };
  const tickets = await BuyTicket.find(query).populate('fk_ticket_id', 'name points description available');

  res.status(200).json(new APIResponse(200, "Buy tickets fetched successfully", tickets));
});
