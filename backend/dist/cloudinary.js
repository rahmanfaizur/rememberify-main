"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function urlHandler(fetchUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = cloudinary_1.v2.url(fetchUrl, {
            transformation: [
                {
                    fetch_format: 'auto', // Most efficient format for that device maybe webp and also it decreases the size of the image/gif!
                },
                {
                    quality: 'auto' // This decreases quality while not compromising the image quality!
                },
                // {
                //     width: 1200
                // }
            ]
        });
        return { url }; // Return the URL as a JSON object
    });
}
function imageUploader(inputUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield cloudinary_1.v2.uploader.upload(inputUrl);
        const url = cloudinary_1.v2.url(results.public_id, {
            transformation: [
                {
                    quality: "auto",
                    fetch_format: "auto"
                },
                // {
                //     width: 1200,
                //     height: 1200,
                //     crop: "fill",
                //     gravity: "auto"
                // }
            ]
        });
        return { url }; // Return the URL as a JSON object
    });
}
// New function to handle file uploads
function fileUploader(fileBuffer, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: "image",
                    transformation: [
                        {
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        // {
                        //     width: 1200,
                        //     height: 1200,
                        //     crop: "fill",
                        //     gravity: "auto",
                        // },
                    ],
                    public_id: fileName.split('.')[0], // Use the file name (without extension) for the public ID
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
                uploadStream.end(fileBuffer); // Pass the file buffer to the stream
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
    });
}
