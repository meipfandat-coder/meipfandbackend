import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ErrorResponse } from "../lib/errorResponse.js";

export const verifyCollectorSubscription = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user ;

  if (user.role !== "collector") {return next();} 

  const checkout = user.paymentCheckout;

  if (!checkout || !checkout.expireAt || new Date(checkout.expireAt) < new Date()) {
    throw new ErrorResponse(402, 'Subscription expired')
  }
 (req as any).user.paymentCheckout = undefined;
  next();
}
)