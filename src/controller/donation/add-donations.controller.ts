import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";

export const AddDonationController = asyncHandler(async (req, res) => {
  if ((req as any).user.role !== "donor") {
    throw new ErrorResponse(403, "Only Donor is allow to create donation");
  }
  validateData(req.body, [
    "preferred_contact_method",
    "preferred_pickup_time",
    "preferred_pickup_date",
    "pickup_address_cords",
    "pickup_address",
    "type_of_bottles",
    "number_of_bottles",
  ]);

 const donation =  await Donation.create(
    {
      ...req.body,
      created_by: (req as any).user._id,
    }
  );

  res.status(201).json(new APIResponse(201, 'Donation created successfully',donation.toObject()))
});
