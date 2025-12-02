
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

export function signJwtToken(user : UserToSign) {
    const token = jwt.sign(
        { id : user.id, name : user.name, email : user.email },
        jwt_sec
    )
}


export function verifyJwtToken(token : string) : JwtTokenDecoed {
    return jwt.verify(token, jwt_sec) as JwtTokenDecoed
}