import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";
import StripeInstance from "../../lib/stripe.js";

export const CreateCheckoutSessionController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== "collector") {
    throw new ErrorResponse(403, "Collector donor allowed");
  }

  validateData(req.body, ["package_id", "success_url", "cancel_url"]);
  const { package_id, success_url, cancel_url } = req.body;

  const pkg = await Package.findById(package_id);
  if (!pkg) {
    throw new ErrorResponse(404, "Package not found");
  }

  const stripe = StripeInstance();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: pkg.name,
            description: pkg.description ?? 'N/A',
          },
          unit_amount: pkg.amount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      package_id: pkg._id.toString(),
      user_id: user._id.toString(),
    },
    success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url,
  });

  res.status(201).json(new APIResponse(201, "Session created", { session_id: session.id }));
});
