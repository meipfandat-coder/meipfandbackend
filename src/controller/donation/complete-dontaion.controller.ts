import { Mongoose } from "mongoose";
import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";
import { Point } from "../../models/point.model.js";

export const CompleteDonationController = asyncHandler(async (req, res) => {
  
if ((req as any).user.role !== "donor") {
    throw new ErrorResponse(403, "Only Donor is allow to accept donation");
  }

  validateData(req.params, ["id"]);
  const { id } = req.params;
  
  const donationCheck = await Donation.findOne({_id:id});
  
  if (!donationCheck) {
    throw new ErrorResponse(403, "Donation not exist");
  }else if(donationCheck.status !== 'complete'){
    throw new ErrorResponse(403, `Donation is not able to complete as its already : ${donationCheck.status}`);
  }

  const donation = await Donation.findByIdAndUpdate(id, {status:'completed', accepted_by:(req as any).user._id},{new:true})
  
  const existing = await Point.findOne({ fk_user_id: donation.created_by });
  const points = donation.number_of_bottles;
  if (existing) {
    // Update existing document
    await Point.findOneAndUpdate(
      { fk_user_id: donation.created_by },
      {
        $inc: {
          current_points: points,
          total_points: points,
        },
        $push: {
          points_logs: {
            fk_donation_id: donation._id,
            points: points,
          },
        },
      },
      { new: true }
    );
  } else {
    // Create new document
    const newPoints = new Point({
      fk_user_id: donation._id,
      current_points: points,
      total_points: points,
      points_logs: [
        {
          fk_donation_id: donation._id,
          points: points,
        },
      ],
    });

    await newPoints.save();
  }

  res
    .status(201)
    .json(new APIResponse(201, "donation completed successfully", donation));
});
