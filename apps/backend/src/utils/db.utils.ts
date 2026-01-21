import { prisma } from "@repo/db"
import { verifyJwtToken } from "./jwttoken.utils"

interface User {
    id: string;
    email: string;
    username: string | null;
    name: string | null;
    password: string;
    createdAt: Date;
    lastLogin: Date | null;
}

export const getUserFromDbUsingTokenFromCookies = async (token : string) : Promise<User | null>  => {
    
    const decoded = verifyJwtToken(token)
    const id = decoded.id 
    const user = await prisma.user.findUnique({
        where : {
            id
        }
    })


    if (!user) return null

    return user
    
}