import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Ticket } from "../../models/ticket.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const UpdateTicketController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can update tickets");
  }

  validateData(req.body, ['name','points']);

  const ticketId = req.params.id;
  
  const {name, description, points} = req.body;

  const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {name, description, points}, {
    new: true,
  });

  if (!updatedTicket) {
    throw new ErrorResponse(404, "Ticket not found");
  }

  res.status(200).json(new APIResponse(200, "Ticket updated successfully", updatedTicket));
});
