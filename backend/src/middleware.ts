import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_PASS = process.env.JWT_PASS;

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
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