
import jwt from "jsonwebtoken"
const jwt_sec = process.env.JWT_SECRET || "sec"


interface JwtTokenDecoed {
    id : string,
    name : string | null,
    email : string
}

export function verifyJwtToken(token : string) : JwtTokenDecoed {
    return jwt.verify(token, jwt_sec) as JwtTokenDecoed
}