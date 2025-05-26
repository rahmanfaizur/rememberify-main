import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import { IGoogleUser } from "./types/auth";
import { Session } from 'express-session';

dotenv.config();

const JWT_PASS = process.env.JWT_PASS;

// Extend the Session type to include passport
interface CustomSession extends Session {
    passport?: {
        user: string;
    };
}

// Extend the Request type to include our custom session
interface CustomRequest extends Request {
    session: CustomSession;
}

export const userMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"] ?? "";
    
    // First try JWT authentication
    try {
        const decoded = jwt.verify(header as string, JWT_PASS as string);
        if (decoded) {
            if (typeof decoded === 'string') {
                // If JWT fails, try Google authentication
                if (req.session?.passport?.user) {
                    req.userId = req.session.passport.user;
                    next();
                    return;
                }
                res.status(403).json({
                    message: "You aint logged in!"
                });
                return;
            }
            req.userId = (decoded as JwtPayload).id;
            next();
            return;
        }
    } catch (error) {
        // If JWT fails, try Google authentication
        if (req.session?.passport?.user) {
            req.userId = req.session.passport.user;
            next();
            return;
        }
        res.status(403).json({
            message: "You aint logged in!"
        });
    }
}

// Middleware to check if the user is logged in via Google
export function isLoggedInGoogle(req: CustomRequest, res: Response, next: NextFunction) {
    if (req.session?.passport?.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// JWT verification middleware (for frontend routes)
export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        // Create a user object from the JWT payload
        const user: Partial<IGoogleUser> = {
            _id: (decoded as JwtPayload).id,
            username: (decoded as JwtPayload).username || '',
            googleId: (decoded as JwtPayload).googleId || '',
        };

        req.user = user as Express.User;
        next();
    });
}
