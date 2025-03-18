"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const db_1 = require("../db");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/dashboard",
    passReqToCallback: true
}, async (_request, _accessToken, _refreshToken, profile, done) => {
    try {
        let user = await db_1.googleUserModel.findOne({ googleId: profile.id });
        if (!user) {
            user = new db_1.googleUserModel({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails?.[0]?.value,
                profilePicture: profile.photos?.[0]?.value,
            });
            try {
                await user.save();
            }
            catch (err) {
                if (err.code === 11000) {
                    user.username = `${profile.displayName}-${Math.floor(Math.random() * 1000)}`;
                    await user.save();
                }
                else {
                    throw err;
                }
            }
        }
        return done(null, user.id);
    }
    catch (err) {
        return done(err, null);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await db_1.googleUserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
