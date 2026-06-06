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
app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
