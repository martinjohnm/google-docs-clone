import { prisma } from "@repo/db";
import { Router } from "express";
import { verifyJwtToken } from "../utils/jwttoken.utils";
import { OK, UNPROCESSABLE_ENTITY } from "@repo/types/http-types";
import { UserProtectionMiddleware } from "../middlewares/user.middleware";
import { getUserFromDbUsingTokenFromCookies } from "../utils/db.utils";



const router = Router()
const cookie_name = process.env.COOKIE_NAME || "token-my-docs"


router.post("/create", UserProtectionMiddleware,  async (req, res) => {

    try {
        
        const token = req.cookies[cookie_name]
        const user = await getUserFromDbUsingTokenFromCookies(token)

        if (!user) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : "invalid credentials"
            })
            return
        }

        const newDoc = await prisma.document.create({
            data : {
                title : "untitled",
                members : {
                    create : [
                        {
                            userId : user.id,
                            role : "OWNER"
                        }
                    ]
                }
            }
        })

        res.status(OK).json({
            message : "Document Created successfully",
            documentId : newDoc.id
        })
        return

        
    } catch(e) {

    }
    
})

router.get("/get", (req, res) => {

})

router.put("/change-user-role", (req, res) => {

})

router.delete("/delete", (req, res) => {

})


export default router