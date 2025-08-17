import { Mongoose } from "mongoose";
import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";

export const AcceptDonationController = asyncHandler(async (req, res) => {

if ((req as any).user.role !== "collector") {
    throw new ErrorResponse(403, "Only Collector is allow to accept donation");
  }

  validateData(req.params, ["id"]);
  const { id } = req.params;
  
  const donationCheck = await Donation.findOne({_id:id});
  
  if (!donationCheck) {
    throw new ErrorResponse(403, "Donation not exist");
  }else if(donationCheck.status !== 'pending'){
    throw new ErrorResponse(403, `Donation is not able to accept as its already : ${donationCheck.status}`);
  }

  const donation = await Donation.findByIdAndUpdate(id, {status:'assigned', accepted_by:(req as any).user._id},{new:true})

  res
    .status(201)
    .json(new APIResponse(201, "donation accepted successfully", donation));
});
