import type { NextFunction, Request, Response } from "express";
import { z, ZodObject } from "zod";
import { ApiResponse } from "../utils/api-response";
import ApiError from "../utils/api-error";

export const validateWithZod =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = z.treeifyError(result.error);
      throw new ApiError(400, "Validation error", errors);
    }

    req.body = result.data;
    next();
  };
