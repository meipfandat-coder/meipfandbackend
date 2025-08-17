import Stripe from "stripe";
import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package, PaymentCheckout } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";
import { validateData } from "../../lib/validateData.js";
import StripeInstance from "../../lib/stripe.js";


export const VerifyCheckoutSessionController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  validateData(req.body, ["session_id"]);
  const { session_id } = req.body;

  const stripe = StripeInstance()
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (!session || session.payment_status !== "paid") {
    throw new ErrorResponse(400, "Payment not verified");
  }

  const sessionAlreadyUsed = await PaymentCheckout.findOne({
  "sessions.session_id": session_id,
   });

  if (sessionAlreadyUsed) {
  throw new ErrorResponse(400, "Session ID already used (possible scam attempt)");
  }


  const package_id = session.metadata?.package_id;
  const pkg = await Package.findById(package_id);
  if (!pkg) {
    throw new ErrorResponse(404, "Package not found");
  }

  let record = await PaymentCheckout.findOne({ user: user._id });

  const newExpire = new Date();
  newExpire.setFullYear(newExpire.getFullYear() + pkg.years);
  newExpire.setMonth(newExpire.getMonth() + pkg.months);

  if (!record) {
    record = await PaymentCheckout.create({
      user: user._id,
      expireAt: newExpire,
      sessions: [],
    });
  } else {

    const current = new Date(record.expireAt);
    if (current > new Date()) {
      current.setFullYear(current.getFullYear() + pkg.years);
      current.setMonth(current.getMonth() + pkg.months);
      record.expireAt = current;
    } else {
      record.expireAt = newExpire;
    }
  }

  record.sessions.push({
    session_id,
    amount: pkg.amount,
    package_id: pkg._id,
    createdAt: new Date(),
  });

  await record.save();

  res.status(200).json(new APIResponse(201, "Payment verified", record));
});
