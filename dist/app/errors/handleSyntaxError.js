"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSyntaxError = void 0;
const ApiError_1 = require("./ApiError");
const handleSyntaxError = () => new ApiError_1.AppError("Invalid JSON in request body. Please check your request format.", 400);
exports.handleSyntaxError = handleSyntaxError;
