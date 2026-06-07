import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error-middlewares";

const app = express();
const MODE = process.env.NODE_ENV == "development" ? "dev" : "tiny";
console.log("", process.env.CORS_ORIGIN);
app.use(morgan(MODE));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (_req, res) => {
  return res.json({ message: "server is up" });
});

import authRouter from "./routes/auth-routes";
import adminRouter from "./routes/admin-routes";
import storeRouter from "./routes/store-routes";
import ratingRouter from "./routes/rating-routes";
import storeOwnerRouter from "./routes/store-owner-routes";

app.use("/api/auth", authRouter);
// admin only routes
app.use("/api/admin", adminRouter);

app.use("/api/stores", storeRouter);
app.use("/api/ratings", ratingRouter);

//store owner routes
app.use("/api/store-owner", storeOwnerRouter);

app.use(errorHandler);

export default app;
