import express, { Request, Response } from "express";
import { APIResponse } from "../lib/apiResponse.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { GetTicketsController } from "../controller/ticket/get-all-tickets.controller.js";
import { UpdateTicketController } from "../controller/ticket/update-ticket.controller.js";
import { BuyTicketController } from "../controller/ticket/buy-ticket.controller.js";
import { AddTicketController } from "../controller/ticket/add-ticket.controller.js";
import { UpdateTicketAvailabilityController } from "../controller/ticket/update-availability-ticket.controller.js";
import { DeactivateAllBuysController } from "../controller/ticket/deactivate-all-buys.controller.js";
import { UpdateWinnerStatusController } from "../controller/ticket/winner-buy.controller.js";
import { GetBuyTicketsController } from "../controller/ticket/get-buy-tickets.controller.js";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
  res.status(200).json(new APIResponse(200, "ticket service is working", {}));
});

router.get("/all-tickets", VerifyAccessTokenMiddleware ,GetTicketsController);
router.post("/",VerifyAccessTokenMiddleware, AddTicketController);
router.put("/:id",VerifyAccessTokenMiddleware, UpdateTicketController);
router.delete("/availbilty/:id",VerifyAccessTokenMiddleware, UpdateTicketAvailabilityController);
router.post("/buy",VerifyAccessTokenMiddleware, BuyTicketController);
router.put("/deactivate/:id", VerifyAccessTokenMiddleware, DeactivateAllBuysController);
router.put("/update-winner", VerifyAccessTokenMiddleware, UpdateWinnerStatusController);
router.get("/all", VerifyAccessTokenMiddleware, GetBuyTicketsController);

export const ticketRouter = router;