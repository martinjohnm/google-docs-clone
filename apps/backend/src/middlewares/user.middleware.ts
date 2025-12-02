import { NextFunction, Request, Response } from "express"
const cookie_name = process.env.COOKIE_NAME || "token-my-docs"



export const UserCookieMiddleware = (req : Request, res: Response, next : NextFunction) => {
    const token = req.cookies[cookie_name]
    
    if (!token) {
        res.status(401).json({
            error  : "No auth cookie found"
        })
        return
    };

    next();
}