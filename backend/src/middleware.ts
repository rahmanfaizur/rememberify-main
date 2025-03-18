import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_PASS = process.env.JWT_PASS;

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(header as string, JWT_PASS as string);
    if (decoded) {
        //@ts-ignore
        // req.userId = decoded.id; //or!
        if (typeof decoded === 'string') {
            res.status(403).json({
                message: "You aint logged in!"
            });
            return
        }
        req.userId = (decoded as JwtPayload).id;
        next()
    } else {
        res.status(403).json({
            message: "You aint logged in!"
        })
    }
}
// Middleware to check if the user is logged in via Google
export function isLoggedInGoogle(req: Request, res: Response, next: NextFunction) {
  req.user ? next() : res.sendStatus(401);
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

    req.user = decoded; // Attach the decoded user info to the request
    next();
  });
}
