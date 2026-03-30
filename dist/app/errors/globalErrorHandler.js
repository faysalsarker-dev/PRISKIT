"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client/runtime/client");
const zod_1 = require("zod");
const prismaErrorHandler_1 = require("./prismaErrorHandler");
const handleZodError_1 = require("./handleZodError");
const handleSyntaxError_1 = require("./handleSyntaxError");
const cloudinary_config_1 = require("../config/cloudinary.config");
// ─────────────────────────────────────────────────────────────────────────────
const globalErrorHandler = async (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // 1. image 
    if (req.file) {
        console.log(`Image delete from Cloudninary public id ${req.file.path}`);
        await (0, cloudinary_config_1.deleteImageFromCLoudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = req.files.map((file) => file.path);
        await Promise.all(imageUrls.map((url) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    // 2. Prisma
    if (err instanceof client_1.PrismaClientKnownRequestError) {
        error = (0, prismaErrorHandler_1.handlePrismaError)(err);
    }
    // 3. Zod
    else if (err instanceof zod_1.ZodError) {
        error = (0, handleZodError_1.handleZodError)(err);
    }
    // 4. Bad JSON body
    else if (err instanceof SyntaxError && "body" in err) {
        error = (0, handleSyntaxError_1.handleSyntaxError)();
    }
    const statusCode = error.statusCode || 500;
    const status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    res.status(statusCode).json({
        status,
        message: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
