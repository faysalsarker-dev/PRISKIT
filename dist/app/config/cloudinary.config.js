"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.deleteImageFromCLoudinary = exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = __importDefault(require("stream"));
const _1 = require(".");
const ApiError_1 = require("../errors/ApiError");
cloudinary_1.v2.config({
    cloud_name: _1.config.cloudinary.cloudName,
    api_key: _1.config.cloudinary.apiKey,
    api_secret: _1.config.cloudinary.apiSecret
});
const uploadBufferToCloudinary = async (buffer, fileName) => {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf"
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(buffer);
        });
    }
    catch (error) {
        console.log(error);
        throw new ApiError_1.AppError(`Error uploading file ${error.message}`, 401);
    }
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const deleteImageFromCLoudinary = async (url) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        console.log({ match });
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary_1.v2.uploader.destroy(public_id);
            console.log(`File ${public_id} is deleted from cloudinary`);
        }
    }
    catch (error) {
        throw new ApiError_1.AppError(`Cloudinary image deletion failed ${error.message}`, 401);
    }
};
exports.deleteImageFromCLoudinary = deleteImageFromCLoudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
