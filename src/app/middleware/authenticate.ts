

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/ApiError";
import httpStatus from "http-status";

export const checkAuth =
  (authRoles?: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;


if (!accessToken) {
  console.log("No access token found in cookies", req.originalUrl);
  throw new AppError("No token provided", httpStatus.UNAUTHORIZED);
}

let verifiedToken: JwtPayload;

try {
  verifiedToken = verifyToken(accessToken) as JwtPayload;
} catch (err: any) {
  if (err.name === "TokenExpiredError") {
    return next(
      new AppError("JWT expired", httpStatus.UNAUTHORIZED)
    );
  }

  if (err.name === "JsonWebTokenError") {
    return next(
      new AppError("Invalid token", httpStatus.UNAUTHORIZED)
    );
  }

  return next(
    new AppError("Unauthorized", httpStatus.UNAUTHORIZED)
  );
}

if (!verifiedToken) {
  throw new AppError("Invalid token", httpStatus.UNAUTHORIZED);
}

if (authRoles && !authRoles.includes(verifiedToken.role)) {
  throw new AppError(
    "You are not authorized to access this resource",
    httpStatus.FORBIDDEN
  );
}

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("JWT error:", error);
      next(error);
    }
  };