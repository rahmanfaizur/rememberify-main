"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
exports.isLoggedInGoogle = isLoggedInGoogle;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_PASS = process.env.JWT_PASS;
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"] ?? "";
    const decoded = jsonwebtoken_1.default.verify(header, JWT_PASS);
    if (decoded) {
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
function isLoggedInGoogle(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
function verifyJWT(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.sendStatus(403);
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    });
}
