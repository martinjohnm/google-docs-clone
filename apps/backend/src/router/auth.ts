import { prisma } from "@repo/db";
import { Request, Response, Router } from "express";
import { userCreationInput, userLoginInput } from "@repo/types/zod-types"
import { comparePassword, hashPassword } from "../utils/password.utils";
import { signJwtToken, verifyJwtToken } from "../utils/jwttoken.utils";
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "@repo/types/http-types"
import { CookieOption } from "../utils/cookie.header";

const router = Router()

const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const cookie_name = process.env.COOKIE_NAME || "token-my-docs"



router.post("/signup-local", async (req: Request, res : Response) => {
    
    try {
        console.log("hi from signup");
        
        const schema = userCreationInput.safeParse(req.body)
        if (!schema.success) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : schema.error
            })
            return
        }

        if (!schema.data) {
            res.status(UNPROCESSABLE_ENTITY).json({
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
            res.status(CONFLICT).json({
                message : "user already exists"
            })
            return
        }

        const hashedPassowrd = await hashPassword(schema.data.password)
        const {confirmPassword,...userCreationData} = schema.data
        
        const newUser = await prisma.user.create({
            data : {
                ...userCreationData,
                password : hashedPassowrd
            }
        })

        
        const token = signJwtToken(newUser)
        console.log(token);
        

        const {password, ...safeUser} = newUser

        res.cookie(cookie_name, token, CookieOption)
        res.status(OK).json({
            message : "User fetched successfully",
            user : safeUser
        })
        return
    } catch(e) {
        console.log(e);
        
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
    
})

router.post("/login-local", async (req : Request, res : Response) => {
    try {

        
        const schema = userLoginInput.safeParse(req.body)
        if (!schema.success) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : schema.error
            })
            return
        }

        if (!schema.data) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : "Input error"
            })
            return
        }


        const userDb = await prisma.user.findUnique({
            where : {
                email : schema.data.email
            }
        })

        if (!userDb) {
            res.status(NOT_FOUND).json({
                message : "No such user"
            })
            return
        }

        const isPasswordvalid = await comparePassword(schema.data.password, userDb.password)

        if (!isPasswordvalid) {
            res.status(UNAUTHORIZED).json({
                message : "Incorrect password"
            })
            return
        }


        const token = signJwtToken(userDb)
        const {password, ...user} = userDb
        

        res.cookie(cookie_name, token, CookieOption)
        res.status(OK).json({
            message : "Login successfull",
            user, 
            token
        })


    } catch(e) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
})

router.post("/logout", async (req : Request, res : Response) => {
    try {
        
        res.clearCookie(cookie_name, CookieOption);

        return res.status(OK).json({ message: "Logged out" });
        
    } catch(e) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
})


router.get("/me", async (req : Request, res : Response) => {    

    try {
        const token = req.cookies[cookie_name]
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
        
        const {password, ...safeUser} = user

        res.status(OK).json({
            message : "User fetched successfully",
            user : safeUser
        })
    } catch(e) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
    
})


export default router