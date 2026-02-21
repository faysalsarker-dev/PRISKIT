"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./app/errors/globalErrorHandler");
const ApiError_1 = require("./app/errors/ApiError");
const index_1 = require("./app/routes/index");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL
        ? [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"]
        : ["http://localhost:3000", "http://localhost:5173", "http://192.168.0.127:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`🚀 [${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        version: "1.0.0",
    });
});
app.use("/api/v1", index_1.router);
app.use((req, _res, next) => {
    next(new ApiError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
