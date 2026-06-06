import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode =
    "statusCode" in err && typeof err.statusCode === "number"
      ? err.statusCode
      : 500;

  const errors = "errors" in err ? err.errors : null;
  console.log("err.message", err.message);
  return res.status(statusCode).json({
    message: err.message,
    name: err.name,
    statusCode,
    success: false,
    errors,
  });
};
