import mongoose, { Mongoose } from "mongoose";
import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";

export const DeleteDonationController = asyncHandler(async (req, res) => {
  
  if ((req as any).user.role === "collector") {
    throw new ErrorResponse(403, "Collector is not allow to delete donation");
  }

  validateData(req.params, ["id"]);
  const { id } = req.params;
  
  const donationCheck = await Donation.findOne({_id:id});
  
  if (!donationCheck) {
    throw new ErrorResponse(403, "Donation not exist");
  }else if((req as any).user.role=== 'donor' && donationCheck.created_by !== new mongoose.Types.ObjectId((req as any).user._id)){
    throw new ErrorResponse(403, `Not allow to delete any other Donor Donation`);
  }
  
  await Donation.findByIdAndDelete(id)

  res
    .status(201)
    .json(new APIResponse(201, "donation deleted successfully", {}));
});
