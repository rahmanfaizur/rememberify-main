import { Router } from "express";
import passport from "passport";
import { isLoggedInGoogle } from "../middleware";
import jwt from "jsonwebtoken";
import { googleUserModel } from "../db";
import { Request, Response } from "express";

const router = Router();

// Get the base URL from environment variable or default to localhost
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Log URLs for debugging
console.log('Backend URL:', BASE_URL);
console.log('Frontend URL:', FRONTEND_URL);

// Google OAuth routes
router.get("/auth/google", (req: Request, res: Response, next) => {
    // Get state from query parameter or create new one
    let state = req.query.state as string;
    if (!state) {
        state = Buffer.from(JSON.stringify({ 
            redirectUrl: FRONTEND_URL,
            timestamp: new Date().getTime()
        })).toString('base64');
    }
    
    console.log('Initiating Google OAuth with state:', state);
    
    passport.authenticate("google", { 
        scope: ["email", "profile", "openid"],
        state,
        prompt: "select_account",
        accessType: "offline"
    })(req, res, next);
});

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { 
        failureRedirect: "/auth/failure",
        session: false
    }),
    async (req: Request, res: Response) => {
        try {
            console.log('Received Google callback');
            
            if (!req.user) {
                throw new Error("User not found in request");
            }

            // Get user data
            const user = await googleUserModel.findById(req.user._id).select('-__v');
            if (!user) {
                throw new Error("User not found in database");
            }

            // Generate JWT token for the authenticated user
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_PASS as string
            );

            // Get the frontend URL from state
            let redirectUrl = FRONTEND_URL;
            try {
                if (req.query.state) {
                    const state = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString());
                    redirectUrl = state.redirectUrl || FRONTEND_URL;
                }
            } catch (error) {
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
        } catch (error) {
            console.error("Error in Google callback:", error);
            res.redirect("/auth/failure");
        }
    }
);

// Protected route example
router.get("/auth/protected", isLoggedInGoogle, (req: Request, res: Response) => {
    res.json({ message: "Logged in!", user: req.user });
});

// Auth failure route
router.get("/auth/failure", (_req: Request, res: Response) => {
    res.json({ message: "Authentication failed!" });
});

// Get user profile
router.get("/auth/profile", isLoggedInGoogle, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            throw new Error("User not found in request");
        }

        const user = await googleUserModel.findById(req.user._id).select('-__v');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});

export default router;
