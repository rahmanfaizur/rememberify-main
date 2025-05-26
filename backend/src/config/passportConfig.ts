import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleUserModel } from "../db";
import { Request } from "express";

interface GoogleProfile {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
}

// Get the base URL from environment variable or default to localhost
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
const CALLBACK_URL = `${BASE_URL}/api/v1/auth/google/callback`;

// Log the callback URL for debugging
console.log('Google OAuth Callback URL:', CALLBACK_URL);

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: CALLBACK_URL,
    scope: ['profile', 'email', 'openid'],
    passReqToCallback: true
}, async (
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
) => {
    try {
        console.log('Google OAuth Profile:', profile);
        
        // Check if user already exists with this Google ID
        let user = await googleUserModel.findOne({ googleId: profile.id });

        if (!user) {
            // If user doesn't exist, create a new one
            user = await googleUserModel.create({
                googleId: profile.id,
                username: profile.displayName || `user_${profile.id.slice(0, 8)}`,
                email: profile.emails?.[0]?.value || '',
                profilePicture: profile.photos?.[0]?.value,
                lastLogin: new Date(),
                isGoogleUser: true
            });
        } else {
            // Update existing user's information
            user.lastLogin = new Date();
            user.profilePicture = profile.photos?.[0]?.value || user.profilePicture;
            user.username = profile.displayName || user.username;
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error as Error);
    }
}));

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await googleUserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
