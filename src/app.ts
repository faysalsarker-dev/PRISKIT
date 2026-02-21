import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/errors/globalErrorHandler";
import { AppError } from "./app/errors/ApiError";
import { router } from "./app/routes/index"

const app: Application = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"]
      : ["http://localhost:3000", "http://localhost:5173", "http://192.168.0.127:3000"],
    credentials: true,
  })
);


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 


if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    version: "1.0.0",
  });
});

app.use("/api/v1", router);


app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;