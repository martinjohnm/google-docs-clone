
import jwt from "jsonwebtoken"
const jwt_sec = process.env.JWT_SECRET || "sec"

interface UserToSign {
    id: string;
    name: string | null;
    email: string;
}


interface JwtTokenDecoed {
    id : string,
    name : string | null,
    email : string
}

export function signJwtToken(user : UserToSign) : string {
    const name = user.name || "guest"
    const token = jwt.sign(
        { id : user.id, name , email : user.email },
        jwt_sec
    )

    return token
}


export function verifyJwtToken(token : string) : JwtTokenDecoed {
    return jwt.verify(token, jwt_sec) as JwtTokenDecoed
}