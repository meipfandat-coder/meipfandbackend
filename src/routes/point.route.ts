import express, { Request, Response } from "express";
import { APIResponse } from "../lib/apiResponse.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { GetPointsController } from "../controller/point/get-all-points.controller.js";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
  res.status(200).json(new APIResponse(200, "points service is working", {}));
});

router.get("/all-points", VerifyAccessTokenMiddleware, GetPointsController);

export const pointRouter = router;