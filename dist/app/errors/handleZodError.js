"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const ApiError_1 = require("./ApiError");
const handleZodError = (err) => {
    const message = err.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
    return new ApiError_1.AppError(message, 400);
};
exports.handleZodError = handleZodError;
