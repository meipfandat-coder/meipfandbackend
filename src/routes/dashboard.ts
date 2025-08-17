import express , {Response, Request} from "express";
import { RegisterUserController } from "../controller/auth/register.controller.js";
import { APIResponse } from "../lib/apiResponse.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { GetDashboardStatsController } from "../controller/donation/get-dashboard-stats.controller.js";

const router = express.Router();

router.get("/", (_:Request, res:Response) => {
  res.status(200).json(new APIResponse(200, "dashboard service is working", {}));
});
router.get("/stats", VerifyAccessTokenMiddleware, GetDashboardStatsController);

export const dashboardRouter = router;
