import { randomUUID } from "crypto"
import { verifyJwtToken } from "../utils/jwt.utils"
import WebSocket from "ws"




export class User {
    public socket : WebSocket
    // unique id for the user in the room 
    public id : string
    // id of the user from Database
    public userIdFromDb : string

    constructor(token : string, socket : WebSocket) {
        const jwtDecoded = verifyJwtToken(token)
        this.socket = socket
        this.userIdFromDb = jwtDecoded.id;
        this.id = randomUUID()
    }
}
