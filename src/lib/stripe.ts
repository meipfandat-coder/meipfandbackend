import Stripe from "stripe";
import { ErrorResponse } from "./errorResponse.js";

function StripeInstance() {
   const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) throw new ErrorResponse(500, "Stripe secret key not set");
  const stripe = new Stripe(stripeSecret ?? "", {
  apiVersion: "2025-06-30.basil",
  });
  return stripe;
}

export default StripeInstance