import passport from "passport";
import { googleUserModel } from "../db";
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:5173/dashboard",
    passReqToCallback: true
  },
  //@ts-ignore
  async (_request, _accessToken, _refreshToken, profile, done) => {
    try {
      // Check if the user already exists using Google ID
      let user = await googleUserModel.findOne({ googleId: profile.id });

      if (!user) {
        // If the user does not exist, create a new user
        user = new googleUserModel({
          googleId: profile.id,
          username: profile.displayName, // Assigning display name as username initially
          email: profile.emails?.[0]?.value,
          profilePicture: profile.photos?.[0]?.value,
        });

        // Attempt to save the new user, handling duplicate username error
        try {
          await user.save();
        } catch (err) {
          //@ts-ignore
          if (err.code === 11000) { // Check for unique constraint violation
            // If the username is already taken, append a unique suffix
            user.username = `${profile.displayName}-${Math.floor(Math.random() * 1000)}`;
            await user.save();
          } else {
            throw err; // Other errors
          }
        }
      }

      // Return user ID after creation or existing user found
      return done(null, user.id);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await googleUserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
