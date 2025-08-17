import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Ticket } from "../../models/ticket.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";

export const AddTicketController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "admin") {
    throw new ErrorResponse(403, "Only admin can add tickets");
  }
  
  validateData(req.body, ['name','points'])
  const { name, description, points } = req.body;

  const ticket = new Ticket({
    name,
    description,
    points,
  });

  await ticket.save();

  res.status(201).json(new APIResponse(201, "Ticket added successfully", ticket));
});
