import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Ticket } from "../../models/ticket.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const UpdateTicketAvailabilityController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can update ticket availability");
  }


  validateData(req.body, ["available"]);

  const ticketId = req.params.id;
  const { available } = req.body;

  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    { available },
    { new: true }
  );

  if (!updatedTicket) {
    throw new ErrorResponse(404, "Ticket not found");
  }

  res.status(200).json(
    new APIResponse(
      201,
      `Ticket availability updated to ${available}`,
      updatedTicket
    )
  );
});
