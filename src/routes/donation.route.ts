import express from "express"
import { GetDonationsController } from "../controller/donation/get-donations.controller.js";
import { VerifyAccessTokenMiddleware } from "../middleware/verify-access-token.middleware.js";
import { AddDonationController } from "../controller/donation/add-donations.controller.js";
import { GetDonationByIDController } from "../controller/donation/get-donation-by-id.controller.js";
import { UpdateDonationByIDController } from "../controller/donation/update-donation.controller.js";
import { DeleteDonationController } from "../controller/donation/delete-donation.controller.js";
import { AcceptDonationController } from "../controller/donation/accept-donation.controller.js";
import { CompleteDonationController } from "../controller/donation/complete-dontaion.controller.js";
import { verifyCollectorSubscription } from "../middleware/verify-collector-package.middleware.js";
const router = express.Router();

router.get('/',VerifyAccessTokenMiddleware,verifyCollectorSubscription, GetDonationsController)
router.get('/:id',VerifyAccessTokenMiddleware, verifyCollectorSubscription, GetDonationByIDController)
router.patch('/:id',VerifyAccessTokenMiddleware, verifyCollectorSubscription, UpdateDonationByIDController)
router.delete('/:id',VerifyAccessTokenMiddleware, verifyCollectorSubscription, DeleteDonationController)
router.post('/',VerifyAccessTokenMiddleware, verifyCollectorSubscription, AddDonationController)
router.patch('/accept/:id',VerifyAccessTokenMiddleware, verifyCollectorSubscription, AcceptDonationController)
router.patch('/complete/:id',VerifyAccessTokenMiddleware, verifyCollectorSubscription, CompleteDonationController)

export const donationRouter = router;