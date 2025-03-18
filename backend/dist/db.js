"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleUserModel = exports.LinkModel = exports.TagModel = exports.ImageModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
async function connectDb() {
    await mongoose_1.default.connect(MONGO_URL);
    console.log("Connected to the server!");
}
connectDb();
const UserSchema = new mongoose_2.Schema({
    username: { type: String, unique: true },
    password: String
});
exports.UserModel = (0, mongoose_2.model)("User", UserSchema);
const ContentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    type: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.ContentModel = (0, mongoose_2.model)("Content", ContentSchema);
const ImageSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    uploaderId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }]
});
exports.ImageModel = (0, mongoose_2.model)("Image", ImageSchema);
const TagSchema = new mongoose_2.Schema({
    name: { type: String, required: true, unique: true }
});
exports.TagModel = (0, mongoose_2.model)("Tag", TagSchema);
const LinkSchema = new mongoose_2.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true,
        unique: true },
    permissions: {
        type: [String],
        required: true,
    }
});
exports.LinkModel = (0, mongoose_2.model)("Links", LinkSchema);
const googleUserSchema = new mongoose_1.default.Schema({
    googleId: { type: String, unique: true, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    profilePicture: { type: String }
}, { timestamps: true });
exports.googleUserModel = mongoose_1.default.models.User || mongoose_1.default.model("User", googleUserSchema);
