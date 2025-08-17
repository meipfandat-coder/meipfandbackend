import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";

export const UpdateDonationByIDController = asyncHandler(async (req, res) => {
   
    if ((req as any).user.role !== "donor") {
    throw new ErrorResponse(403, "Only Donor is allow to update this donation");
     }

   validateData({...req.params, ...req.body}, ["id","preferred_contact_method",
    "preferred_pickup_time",
    "preferred_pickup_date",
    "pickup_address_cords",
    "pickup_address",
    "type_of_bottles",
    "number_of_bottles",]);
   const {id} = req.params;
   const {preferred_pickup_time , preferred_pickup_date , pickup_address_cords, pickup_address , type_of_bottles, number_of_bottles , instructions,description } = req.body;

  const donationCheck = await Donation.findOne({_id:id});
  
  if (!donationCheck) {
    throw new ErrorResponse(403, "Donation not exist");
  }else if(donationCheck.created_by !== (req as any).user._id){
    throw new ErrorResponse(403, "Any other Donor donation not allow to update");
  }



  const donation = await Donation.findByIdAndUpdate(id, {preferred_pickup_time , preferred_pickup_date , pickup_address_cords, pickup_address , type_of_bottles, number_of_bottles , instructions,description }, {new:true})

  res
    .status(200)
    .json(new APIResponse(200, "donation updated successfully", donation));
});
