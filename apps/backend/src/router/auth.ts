import { prisma } from "@repo/db";
import { Request, Response, Router } from "express";
import { userCreationInput } from "@repo/types/auth"
import jwt from "jsonwebtoken"
import { UserCookieMiddleware } from "../middlewares/user.middleware";

const router = Router()

const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const jwt_sec = process.env.JWT_SECRET || "sec"
const cookie_name = process.env.COOKIE_NAME || "token-my-docs"

interface JwtTokenDecoed {
    id : string,
    name : string,
    email : string
}


router.post("/signup-local", async (req: Request, res : Response) => {
    
    try {
        const schema = userCreationInput.safeParse(req.body)
        if (!schema.success) {
            res.json({
                message : schema.error
            })
        }

        if (!schema.data) {
            res.json({
                message : "Input error"
            })
            return
        }
        const userDb = await prisma.user.findUnique({
            where : {
                email : schema.data.email
            }
        })

        if (userDb) {
            res.json({
                message : "user already exists"
            })
            return
        }
        
        const newUser = await prisma.user.create({
            data : schema.data
        })

        const token = jwt.sign(
            { id : newUser.id, name : newUser.name, email : newUser.email },
            jwt_sec
        )

        const userDetails = {
            id : newUser.id,
            name : newUser.name,
            email : newUser.email,
            token
        }

        res.cookie(cookie_name, token, {
            httpOnly : true,
            secure : true,
            sameSite : "lax"
        })
        res.status(201).json({
            message : "User created successfully",
            userDetails
        })
    } catch(e) {
        res.status(500).json({
            message : "Server error"
        })
    }
    
})


router.get("/get-user", UserCookieMiddleware, async (req : Request, res : Response) => {    

    const token = req.cookies[cookie_name]

    const decoded = jwt.verify(token, jwt_sec) as JwtTokenDecoed
    const id = decoded.id 
    const user = await prisma.user.findUnique({
        where : {
            id
        }
    })

    if (!user) {
        res.json({
            message : "invalid credentials"
        })
        return
    }
    
    res.json({
        user
    })
})


export default router