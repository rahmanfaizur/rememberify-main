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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("../db");
// Get the base URL from environment variable or default to localhost
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
const CALLBACK_URL = `${BASE_URL}/api/v1/auth/google/callback`;
// Log the callback URL for debugging
console.log('Google OAuth Callback URL:', CALLBACK_URL);
// Configure Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['profile', 'email', 'openid'],
    passReqToCallback: true
}, (req, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        console.log('Google OAuth Profile:', profile);
        // Check if user already exists with this Google ID
        let user = yield db_1.googleUserModel.findOne({ googleId: profile.id });
        if (!user) {
            // If user doesn't exist, create a new one
            user = yield db_1.googleUserModel.create({
                googleId: profile.id,
                username: profile.displayName || `user_${profile.id.slice(0, 8)}`,
                email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
                profilePicture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                lastLogin: new Date(),
                isGoogleUser: true
            });
        }
        else {
            // Update existing user's information
            user.lastLogin = new Date();
            user.profilePicture = ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || user.profilePicture;
            user.username = profile.displayName || user.username;
            yield user.save();
        }
        return done(null, user);
    }
    catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error);
    }
})));
// Serialize user for the session
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
// Deserialize user from the session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.googleUserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
