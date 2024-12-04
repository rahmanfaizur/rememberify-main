"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_PASS = process.env.JWT_PASS;
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(header, JWT_PASS);
    if (decoded) {
        //@ts-ignore
        // req.userId = decoded.id; //or!
        if (typeof decoded === 'string') {
            res.status(403).json({
                message: "You aint logged in!"
            });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You aint logged in!"
        });
    }
};
exports.userMiddleware = userMiddleware;
