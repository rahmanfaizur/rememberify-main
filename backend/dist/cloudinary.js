"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlHandler = urlHandler;
exports.imageUploader = imageUploader;
exports.fileUploader = fileUploader;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
async function urlHandler(fetchUrl) {
    const url = cloudinary_1.v2.url(fetchUrl, {
        transformation: [
            {
                fetch_format: 'auto',
            },
            {
                quality: 'auto'
            },
        ]
    });
    return { url };
}
async function imageUploader(inputUrl) {
    const results = await cloudinary_1.v2.uploader.upload(inputUrl);
    const url = cloudinary_1.v2.url(results.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto"
            },
        ]
    });
    return { url };
}
async function fileUploader(fileBuffer, fileName) {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                resource_type: "image",
                transformation: [
                    {
                        quality: "auto",
                        fetch_format: "auto",
                    },
                ],
                public_id: fileName.split('.')[0],
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            uploadStream.end(fileBuffer);
        });
        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }
    catch (error) {
        console.error("File upload failed:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
}
