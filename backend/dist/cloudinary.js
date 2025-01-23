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
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlHandler = urlHandler;
exports.imageUploader = imageUploader;
const cloudinary_1 = require("cloudinary");
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
                {
                    width: 1200
                }
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
                {
                    width: 1200,
                    height: 1200,
                    crop: "fill",
                    gravity: "auto"
                }
            ]
        });
        return { url }; // Return the URL as a JSON object
    });
}
