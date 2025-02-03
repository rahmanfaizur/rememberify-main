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
const db_1 = require("./db");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, 
//@ts-ignore
(_request, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Check if the user already exists using Google ID
        let user = yield db_1.googleUserModel.findOne({ googleId: profile.id });
        if (!user) {
            // If the user does not exist, create a new user
            user = new db_1.googleUserModel({
                googleId: profile.id,
                username: profile.displayName, // Assigning display name as username initially
                email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value,
                profilePicture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
            });
            // Attempt to save the new user, handling duplicate username error
            try {
                yield user.save();
            }
            catch (err) {
                if (err.code === 11000) { // Check for unique constraint violation
                    // If the username is already taken, append a unique suffix
                    user.username = `${profile.displayName}-${Math.floor(Math.random() * 1000)}`;
                    yield user.save();
                }
                else {
                    throw err; // Other errors
                }
            }
        }
        // Return user ID after creation or existing user found
        return done(null, user.id);
    }
    catch (err) {
        return done(err, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.googleUserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
