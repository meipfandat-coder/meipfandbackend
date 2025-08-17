import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { BuyTicket } from "../../models/ticket.model.js";

export const DeactivateAllBuysController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can perform this action");
  }

  const ticketId = req.params.id;
  if (!ticketId) {
    throw new ErrorResponse(400, "Ticket ID is required");
  }

  const updated = await BuyTicket.updateMany(
    { fk_ticket_id: ticketId, active: true },
    { active: false }
  );

  res.status(201).json(new APIResponse(201, "All active ticket buys marked inactive", updated));
});
