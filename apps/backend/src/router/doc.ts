import { prisma } from "@repo/db";
import { Router } from "express";
import { verifyJwtToken } from "../utils/jwttoken.utils";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@repo/types/http-types";
import { UserProtectionMiddleware } from "../middlewares/user.middleware";
import { getUserFromDbUsingTokenFromCookies } from "../utils/db.utils";
import { applyOp, reconstructorFromSnapshot, transformAgainstSequence } from "@repo/ot-core";
import { Op } from "@repo/types/ot-types";



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
                },
                snapshots : {
                    create : [
                        {
                            content : "",
                            version : 0
                        }
                    ]
                }
            },
            include : {
                snapshots : true
            }
        })

        res.status(OK).json({
            message : "Document Created successfully",
            documentId : newDoc.id
        })
        return

        
    } catch(e) {
        console.log(e);
        
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
    
})

router.get("/get/:id", UserProtectionMiddleware, async (req, res) => {
    
    try {
        
        const token = req.cookies[cookie_name]
        const user = await getUserFromDbUsingTokenFromCookies(token)

        if (!user) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : "invalid credentials"
            })
            return
        }

        const id = req.params.id 

        if (!id) {
            res.status(UNPROCESSABLE_ENTITY).json({
                message : "invalid credentials"
            })
            return
        }

        const existingDoc = await prisma.document.findUnique({
            where : {
                id
            },
            include : {
                snapshots : {
                    orderBy : {
                        version : "desc"
                    }
                }
            }
        })

        if (!existingDoc) {
            res.status(NOT_FOUND).json({
                message : "No such document"
            })
            return
        }

        const latestSnapshot = existingDoc.snapshots[0]

        if (!latestSnapshot) {
            res.status(NOT_FOUND).json({
                message : "No snapshots something is wrong"
            })
            return
        }


        const operationsAfterLatestSnapshot = await prisma.operation.findMany({
            where : {
                documentId : existingDoc.id,
                version : {
                    gt : latestSnapshot.version
                }
            }, 
            orderBy : {
                version : "desc"
            }
        })
        
        // transform the ops with snapshot to get the latest doc


        const documentData = reconstructorFromSnapshot(latestSnapshot, operationsAfterLatestSnapshot)
        console.log(documentData);
        
        
        res.status(OK).json({
            message : "Document fetched successfully",
            document : documentData
        })
        return

        
    } catch(e) {
        
        console.log(e);
        
        res.status(INTERNAL_SERVER_ERROR).json({
            message : "Server error"
        })
    }
})

router.put("/change-user-role", (req, res) => {

})

router.delete("/delete", (req, res) => {

})


export default router