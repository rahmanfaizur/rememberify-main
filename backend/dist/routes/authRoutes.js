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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const middleware_1 = require("../middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const router = (0, express_1.Router)();
// Get the base URL from environment variable or default to localhost
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// Log URLs for debugging
console.log('Backend URL:', BASE_URL);
console.log('Frontend URL:', FRONTEND_URL);
// Google OAuth routes
router.get("/auth/google", (req, res, next) => {
    // Get state from query parameter or create new one
    let state = req.query.state;
    if (!state) {
        state = Buffer.from(JSON.stringify({
            redirectUrl: FRONTEND_URL,
            timestamp: new Date().getTime()
        })).toString('base64');
    }
    console.log('Initiating Google OAuth with state:', state);
    passport_1.default.authenticate("google", {
        scope: ["email", "profile", "openid"],
        state,
        prompt: "select_account",
        accessType: "offline"
    })(req, res, next);
});
router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/auth/failure",
    session: false
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received Google callback');
        if (!req.user) {
            throw new Error("User not found in request");
        }
        // Get user data
        const user = yield db_1.googleUserModel.findById(req.user._id).select('-__v');
        if (!user) {
            throw new Error("User not found in database");
        }
        // Generate JWT token for the authenticated user
        const token = jsonwebtoken_1.default.sign({ id: req.user._id }, process.env.JWT_PASS);
        // Get the frontend URL from state
        let redirectUrl = FRONTEND_URL;
        try {
            if (req.query.state) {
                const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                redirectUrl = state.redirectUrl || FRONTEND_URL;
            }
        }
        catch (error) {
            console.error("Error parsing state:", error);
        }
        // Encode user data for URL
        const userData = {
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            isGoogleUser: true
        };
        const encodedUserData = Buffer.from(JSON.stringify(userData)).toString('base64');
        console.log('Redirecting to:', `${redirectUrl}/auth/callback?token=${token}&userData=${encodedUserData}`);
        // Redirect to frontend with token and user data
        res.redirect(`${redirectUrl}/auth/callback?token=${token}&userData=${encodedUserData}`);
    }
    catch (error) {
        console.error("Error in Google callback:", error);
        res.redirect("/auth/failure");
    }
}));
// Protected route example
router.get("/auth/protected", middleware_1.isLoggedInGoogle, (req, res) => {
    res.json({ message: "Logged in!", user: req.user });
});
// Auth failure route
router.get("/auth/failure", (_req, res) => {
    res.json({ message: "Authentication failed!" });
});
// Get user profile
router.get("/auth/profile", middleware_1.isLoggedInGoogle, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new Error("User not found in request");
        }
        const user = yield db_1.googleUserModel.findById(req.user._id).select('-__v');
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
}));
exports.default = router;
