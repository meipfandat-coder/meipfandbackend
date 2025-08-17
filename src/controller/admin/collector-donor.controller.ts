import { Request, Response } from "express";
import { ErrorResponse } from "../../lib/errorResponse.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { APIResponse } from "../../lib/apiResponse.js";

export const DonorCollectorController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) throw new ErrorResponse(403, "You are not authorized");
    if (user.role !== 'admin') throw new ErrorResponse(403, `${user.role} is not authorized for this route`);

    const [donors, collectors] = await Promise.all([
      // Donors
      User.aggregate([
        { $match: { role: "donor" } },
        {
          $lookup: {
            from: "donations",
            localField: "_id",
            foreignField: "created_by",
            as: "donations"
          }
        },
        {
          $addFields: {
            pending: {
                $size: {
                  $filter: {
                    input: "$donations",
                    as: "donation",
                    cond: { $eq: ["$$donation.status", "pending"] }
                  }
                }
              },
              active: {
                $size: {
                  $filter: {
                    input: "$donations",
                    as: "donation",
                    cond: { $eq: ["$$donation.status", "assigned"] }
                  }
                }
              },
              completed: {
                $size: {
                  $filter: {
                    input: "$donations",
                    as: "donation",
                    cond: { $eq: ["$$donation.status", "completed"] }
                  }
                }
              }
          }
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            role: 1,
            pending: 1,
            active: 1,
            completed: 1
          }
        }
      ]),
      // Collectors
      User.aggregate([
        { $match: { role: "collector" } },
        {
          $lookup: {
            from: "donations",
            localField: "_id",
            foreignField: "accepted_by",
            as: "donations"
          }
        },
        {
          $addFields: {
            pending: {
                $size: {
                  $filter: {
                    input: "$donations",
                    as: "donation",
                    cond: { $eq: ["$$donation.status", "assigned"] }
                  }
                }
              },
              completed: {
                $size: {
                  $filter: {
                    input: "$donations",
                    as: "donation",
                    cond: { $eq: ["$$donation.status", "completed"] }
                  }
                }
              }
          }
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            role: 1,
            active: 1,
            completed: 1,
          }
        }
      ])
    ]);

     res.status(200).json(
          new APIResponse(200, "Donors and Collectors Get Successfully", {
           donors, collectors
          })
        );
  }
);
