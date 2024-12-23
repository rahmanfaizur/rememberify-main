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
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGO_URL);
        console.log("Connected to the server!");
    });
}
connectDb();
const UserSchema = new mongoose_2.Schema({
    username: { type: String, unique: true },
    password: String
});
exports.UserModel = (0, mongoose_2.model)("User", UserSchema);
//create content schema and then the content endpoint as well!
const ContentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    type: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
exports.ContentModel = (0, mongoose_2.model)("Content", ContentSchema);
const LinkSchema = new mongoose_2.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true,
        unique: true },
    permissions: {
        type: [String], // Array of strings
        required: true, // Add any necessary constraints
    }
});
exports.LinkModel = (0, mongoose_2.model)("Links", LinkSchema);
