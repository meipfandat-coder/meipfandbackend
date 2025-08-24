import express, { Request, Response } from "express";
import { APIResponse } from "../lib/apiResponse.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { GetPackagesController } from "../controller/package/get-packages.controller.js";
import { GetCurrentPackageController } from "../controller/package/get-current-package.controller.js";
import { CreateCheckoutSessionController } from "../controller/package/create-package-payment-session.controller.js";
import { VerifyCheckoutSessionController } from "../controller/package/verify-payment-enable-package.js";
import { CreatePackageController } from "../controller/package/create-package.controller.js";
import { UpdatePackageController } from "../controller/package/update-package.controller.js";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
  res.status(200).json(new APIResponse(200, "packages service is working", {}));
});

router.get("/all-packages", VerifyAccessTokenMiddleware, GetPackagesController);
router.post("/create-package", VerifyAccessTokenMiddleware, CreatePackageController);
router.post("/update-package", VerifyAccessTokenMiddleware, UpdatePackageController);
router.get("/current-package", VerifyAccessTokenMiddleware, GetCurrentPackageController);
router.post("/create-payment", VerifyAccessTokenMiddleware, CreateCheckoutSessionController);
router.get("/verify-payment-enable-package", VerifyAccessTokenMiddleware, VerifyCheckoutSessionController);


export const packageRouter = router;
