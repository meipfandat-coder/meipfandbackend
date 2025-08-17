import { Request, Response } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { Package, PaymentCheckout } from "../../models/package.model.js";
import { APIResponse } from "../../lib/apiResponse.js";

export const GetCurrentPackageController = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user; 
  if (user.role !== "collector") {
    throw new ErrorResponse(403, "Collector donor allowed");
  }
  
  const record = await PaymentCheckout.findOne({ user: user._id });
  if (!record || record.sessions.length === 0) {
    throw new ErrorResponse(404, "No subscription found");
  }

  const lastSession = record.sessions[record.sessions.length - 1];
  const pkg = await Package.findById(lastSession.package_id);
  if (!pkg) {
    throw new ErrorResponse(404, "Last subscribed package not found");
  }

  const actualExpire = record.expireAt;

  const subscribedAt = new Date(lastSession.createdAt);
  const expectedExpire = new Date(subscribedAt);
  expectedExpire.setFullYear(expectedExpire.getFullYear() + pkg.years);
  expectedExpire.setMonth(expectedExpire.getMonth() + pkg.months);

  const carryOverMs = actualExpire.getTime() - expectedExpire.getTime();
  const carryOverDays = Math.ceil(carryOverMs / (1000 * 60 * 60 * 24));

  const extra_time_note =
    carryOverDays > 0
      ? `You have ${carryOverDays} extra day(s) carried over from previous package(s).`
      : null;

  res.status(200).json(
    new APIResponse(200, "Current subscription details", {
      actual_expire: actualExpire,
      last_subscribed_package: {
        id: pkg._id,
        name: pkg.name,
        amount: pkg.amount,
        subscribed_at: subscribedAt,
        duration: `${pkg.years} year(s), ${pkg.months} month(s)`
      },
      extra_time_note
    })
  );
});
