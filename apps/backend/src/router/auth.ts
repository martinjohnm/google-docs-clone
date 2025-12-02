import { prisma } from "@repo/db";
import { Request, Response, Router } from "express";
import { userCreationInput } from "@repo/types/auth"
import jwt from "jsonwebtoken"

const router = Router()

const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const jwt_sec = process.env.JWT_SECRET || "sec"

interface UserDetails {
    email : string, 
    password : string
}

router.post("/login-local", async (req: Request, res : Response) => {
    const credentials = req.body as UserDetails
    const userDb = await prisma.user.findUnique({
        where : {
            email : credentials.email
        }
    })
    res.json({
        hi : "hi"
    })
})

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

export default router