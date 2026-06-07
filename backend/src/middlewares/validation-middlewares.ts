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

type Schema = {
  bodyParser?: ZodObject;
  queryParser?: ZodObject;
  paramsParser?: ZodObject;
};

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export const validator = ({
  bodyParser,
  queryParser,
  paramsParser,
}: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (bodyParser) {
      const result = bodyParser.safeParse(req.body);
      if (!result.success) {
        const errors = z.treeifyError(result.error);
        throw new ApiError(400, "Validation error", errors);
      }
      req.body = result.data;
    }

    if (queryParser) {
      const result = queryParser.safeParse(req.query);

      if (!result.success) {
        const errors = z.treeifyError(result.error);
        throw new ApiError(400, "Validation error", errors);
      }

      req.validatedQuery = result.data;
    }

    if (paramsParser) {
      const result = paramsParser.safeParse(req.params);

      if (!result.success) {
        const errors = z.treeifyError(result.error);
        throw new ApiError(400, "Validation error", errors);
      }
      req.params = result.data as any;
      req.validatedParams = result.data;
    }

    next();
  };
};
