import "dotenv/config";
import express from "express";
import DBConnection from "./db/connect-db.js";
import { Request, Response, NextFunction } from "express";
import { authRouter } from "./routes/auth.route.js";
import {donationRouter} from "./routes/donation.route.js"
import { userRouter } from "./routes/user.route.js";
import { config } from "./config/config.js";
import CookieParser from "cookie-parser";
import cors from "cors";
import { dashboardRouter } from "./routes/dashboard.js";
import { adminRouter } from "./routes/admin.route.js";
import { pointRouter } from "./routes/point.route.js";
import { ticketRouter } from "./routes/ticket.route.js";
import { packageRouter } from "./routes/package.route.js";

const app = express();
DBConnection();
app.use(express.json({ limit: "16mb" }));
app.use(CookieParser());
app.use(cors());

app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    name: "Recycling Bottle",
  });
});

app.use(`${config.V1_URL}/auth`, authRouter);
app.use(`${config.V1_URL}/user`, userRouter);
app.use(`${config.V1_URL}/donation`, donationRouter);
app.use(`${config.V1_URL}/dashboard`, dashboardRouter);
app.use(`${config.V1_URL}/admin`, adminRouter);
app.use(`${config.V1_URL}/points`, pointRouter);
app.use(`${config.V1_URL}/ticket`, ticketRouter);
app.use(`${config.V1_URL}/package`, packageRouter);

app.use(
  (
    err: { status?: number; message?: string },
    _: Request,
    res: Response,
    _next: NextFunction
  ) => {
    res.status(err.status ?? 500).json({
      message: err.message ?? "Something went wrong",
      status: err.status ?? 500,
    });
  }
);

app.listen(config.PORT, () => {
  console.log("server is runing on port : ",config.PORT);
});
