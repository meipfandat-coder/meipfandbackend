import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Ticket, BuyTicket } from "../../models/ticket.model.js";
import { Point } from "../../models/point.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const BuyTicketController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "donor") {
    throw new ErrorResponse(403, "Only donors can buy tickets");
  }

  validateData(req.body, ["id"]); 

  const { id } = req.body;

  const ticket = await Ticket.findOne({ _id: id, available: true });

  if (!ticket) {
    throw new ErrorResponse(404, "Ticket not found or unavailable");
  }

  const userPoints = await Point.findOne({ fk_user_id: user._id });

  if (!userPoints || userPoints.current_points < ticket.points) {
    throw new ErrorResponse(400, "Not enough points to buy this ticket");
  }

  userPoints.current_points -= ticket.points;
  await userPoints.save();
  const count = await BuyTicket.countDocuments(); 
  const reference_number = String((count+1)).padStart(8, '0');
  const boughtTicket = await BuyTicket.create({
    fk_user_id: user._id,
    fk_ticket_id: ticket._id,
    buying_points: ticket.points,
    active: true,
    winner: false,
    reference_number
  });

  res.status(201).json(new APIResponse(201, "Ticket purchased successfully", boughtTicket));
});
