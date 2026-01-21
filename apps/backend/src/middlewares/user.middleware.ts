import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "@repo/types/http-types"
import { NextFunction, Request, Response } from "express"
import { verifyJwtToken } from "../utils/jwttoken.utils"
import { prisma } from "@repo/db"
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


export const UserProtectionMiddleware = async (req : Request, res: Response, next : NextFunction) => {
    const token = req.cookies[cookie_name]
    if (!token) {
        res.status(UNAUTHORIZED).json({
            error  : "No auth cookie found"
        })
        return
    };
    const decoded = verifyJwtToken(token)
    const id = decoded.id 
    const user = await prisma.user.findUnique({
        where : {
            id
        }
    })


    if (!user) {
        res.status(UNPROCESSABLE_ENTITY).json({
            message : "invalid credentials"
        })
        return
    }
    
    req.user = user

    next();
}

