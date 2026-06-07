import ApiError from "../utils/api-error";
import jwt from "jsonwebtoken";
import type { UserRole } from "../db/schema/users";
import type { NextFunction, Request, Response } from "express";

export type userJwtPayload = {
  id: number;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: userJwtPayload;
    }
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token: string =
    req.cookies.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
  ) as userJwtPayload;

  if (!decodedToken) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = {
    id: decodedToken.id,
    role: decodedToken.role,
  };
  next();
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized");
  }
  next();
};

export const requiredRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        401,
        "Unauthorized Access",
        `Required Role: ${roles.join("|")}`,
      );
    }

    next();
  };
};
