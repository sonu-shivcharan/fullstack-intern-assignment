import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error-middlewares";

const app = express();
const MODE = process.env.NODE_ENV == "development" ? "dev" : "tiny";

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

app.use("/api/auth", authRouter);
// admin only routes
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;
