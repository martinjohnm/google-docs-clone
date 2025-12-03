import { UNAUTHORIZED } from "@repo/types/http-types"
import { NextFunction, Request, Response } from "express"
const cookie_name = process.env.COOKIE_NAME || "token-my-docs"



export const UserCookieMiddleware = (req : Request, res: Response, next : NextFunction) => {
    const token = req.cookies[cookie_name]
    
    if (!token) {
        res.status(UNAUTHORIZED).json({
            error  : "No auth cookie found"
        })
        return
    };

    next();
}