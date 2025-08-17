import express , {Response, Request} from "express";
import { RegisterUserController } from "../controller/auth/register.controller.js";
import { VerifyEmailController } from "../controller/auth/verify-email.controller.js";
import { LoginUserController } from "../controller/auth/login.controller.js";
import { ForgotPasswordController } from "../controller/auth/forgot.controller.js";
import { APIResponse } from "../lib/apiResponse.js";
import { UpdatePasswordController } from "../controller/auth/update-password.controller.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { LogoutController } from "../controller/auth/logout.controller.js";
import { RefreshTokenController } from "../controller/auth/refresh-token.controller.js";
const router = express.Router();

router.get("/", (_:Request, res:Response) => {
  res.status(200).json(new APIResponse(200, "auth service is working", {}));
});
router.post("/register", RegisterUserController);
router.post("/verify-email-token", VerifyEmailController);
router.post("/login", LoginUserController);
router.post("/forgot-password", ForgotPasswordController);
router.post("/update-password", UpdatePasswordController);
router.post("/logout", VerifyAccessTokenMiddleware, LogoutController);
router.post("/refresh-token", RefreshTokenController);

export const authRouter = router;
