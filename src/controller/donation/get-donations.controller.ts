import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { Donation } from "../../models/donation.model.js";

export const GetDonationsController = asyncHandler(async (req, res) => {
  const currentUserId = (req as any).user._id;
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

  res
    .status(200)
    .json(new APIResponse(200, "donations get successfully", donations));
});
