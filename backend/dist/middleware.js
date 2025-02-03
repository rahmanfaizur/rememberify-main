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
// Middleware to check if the user is logged in via Google
function isLoggedInGoogle(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
// JWT verification middleware (for frontend routes)
function verifyJWT(req, res, next) {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from header
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = decoded; // Attach the decoded user info to the request
        next();
    });
}
