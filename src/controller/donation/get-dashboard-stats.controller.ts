import mongoose from "mongoose";
import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { Donation } from "../../models/donation.model.js";
import { User } from "../../models/user.model.js";

export const GetDashboardStatsController = asyncHandler(async (req, res) => {
  const currentUserId = new mongoose.Types.ObjectId((req as any).user._id);
  const currentUserRole = (req as any).user.role;
  
  const matchStage =
    currentUserRole === "admin"
      ? {} 
      : currentUserRole === 'donor' ?  {
        created_by: currentUserId
      } : {
        $or:[
           { status: 'pending'},
           { accepted_by: currentUserId}
        ]
      };


  const donations = await Donation.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$created_by" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
            },
          },
        ],
        as: "created_by",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$accepted_by" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$userId"] },
            },
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
            },
          },
        ],
        as: "accepted_by",
      },
    },
    {
      $addFields: {
        created_by: {
          $arrayElemAt: ["$created_by", 0],
        },
        accepted_by: {
          $arrayElemAt: ["$accepted_by", 0],
        },
      },
    },
  ]);
 
  const users = await User.find().select('-forgotToken -refreshToken -password -_id -__v');
 
const total_donations = donations.length;
  const total_active = donations.filter((item)=>item.status==='pending').length;
  const total_assigned = donations.filter((item)=>item.status==='assigned').length;
  const total_completed = donations.filter((item)=>item.status==='completed').length;

  const total_bottles = donations.reduce((value, item)=>{ return value += item.number_of_bottles},0)
  const total_points = Math.floor(total_bottles * 0.33)
  const total_revenue = total_points * 0.33;

  //admin only
  const total_donors = currentUserRole==='admin' ? users.filter((item)=>item.role==='donor').length : null;
  const total_collectors = currentUserRole==='admin' ? users.filter((item)=>item.role==='collector').length : null;

const plasticDonations = donations.filter(item => item.type_of_bottles === 'plastic');

const total_plastic_bottles = plasticDonations.reduce(
  (sum, item) => sum + item.number_of_bottles,
  0
);

const impact_summary = {
  plastic_saved_kg: Number((total_plastic_bottles * 0.03).toFixed(2)),
  co2_reduced_kg: Number((total_plastic_bottles * 0.06).toFixed(2)),
  water_saved_liters: Number((total_plastic_bottles * 0.9).toFixed(0)),
  energy_conserved_kwh: Number((total_plastic_bottles * 1.2).toFixed(0))
};

 
  res
    .status(200)
    .json(new APIResponse(200, "dashboard stats get successfully", {total_donations, total_active, total_assigned, total_completed,   total_bottles, total_points, total_revenue, total_donors, total_collectors, impact_summary }));
});
