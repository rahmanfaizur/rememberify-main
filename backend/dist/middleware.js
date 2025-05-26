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
    var _a, _b, _c, _d, _e;
    const header = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    // First try JWT authentication
    try {
        const decoded = jsonwebtoken_1.default.verify(header, JWT_PASS);
        if (decoded) {
            if (typeof decoded === 'string') {
                // If JWT fails, try Google authentication
                if ((_c = (_b = req.session) === null || _b === void 0 ? void 0 : _b.passport) === null || _c === void 0 ? void 0 : _c.user) {
                    req.userId = req.session.passport.user;
                    next();
                    return;
                }
                res.status(403).json({
                    message: "You aint logged in!"
                });
                return;
            }
            req.userId = decoded.id;
            next();
            return;
        }
    }
    catch (error) {
        // If JWT fails, try Google authentication
        if ((_e = (_d = req.session) === null || _d === void 0 ? void 0 : _d.passport) === null || _e === void 0 ? void 0 : _e.user) {
            req.userId = req.session.passport.user;
            next();
            return;
        }
        res.status(403).json({
            message: "You aint logged in!"
        });
    }
};
exports.userMiddleware = userMiddleware;
// Middleware to check if the user is logged in via Google
function isLoggedInGoogle(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.passport) === null || _b === void 0 ? void 0 : _b.user) {
        next();
    }
    else {
        res.sendStatus(401);
    }
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
        // Create a user object from the JWT payload
        const user = {
            _id: decoded.id,
            username: decoded.username || '',
            googleId: decoded.googleId || '',
        };
        req.user = user;
        next();
    });
}
