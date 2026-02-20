import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { handlePrismaError } from "./prismaErrorHandler";
import { handleZodError } from "./handleZodError";
import { handleSyntaxError } from "./handleSyntaxError";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

// ─────────────────────────────────────────────────────────────────────────────

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;


  // 1. image 
  if (req.file) {
    console.log(`Image delete from Cloudninary public id ${req.file.path}`);
    await deleteImageFromCLoudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  }

  // 2. Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // 3. Zod
  else if (err instanceof ZodError) {
    error = handleZodError(err);
  }

  // 4. Bad JSON body
  else if (err instanceof SyntaxError && "body" in err) {
    error = handleSyntaxError();
  }

  const statusCode = error.statusCode || 500;
  const status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

  res.status(statusCode).json({
    status,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
