import { APIResponse } from "../../lib/apiResponse.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { validateData } from "../../lib/validateData.js";
import { Donation } from "../../models/donation.model.js";

export const GetDonationByIDController = asyncHandler(async (req, res) => {
   validateData(req.params, ['id']);
   const {id} = req.params;

  const donations = await Donation.aggregate([
    {
      $match: {_id:id},
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
