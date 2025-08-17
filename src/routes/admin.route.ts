import express , {Response, Request} from "express";
import { APIResponse } from "../lib/apiResponse.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { DonorCollectorController } from "../controller/admin/collector-donor.controller.js";

const router = express.Router();

router.get("/", (_:Request, res:Response) => {
  res.status(200).json(new APIResponse(200, "admin service is working", {}));
});

router.post("/collector-donor", VerifyAccessTokenMiddleware, DonorCollectorController);

export const adminRouter = router;
