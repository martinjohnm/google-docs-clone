import { Op } from "@repo/types/ot-types"
import { randomUUID } from "crypto"
import { User } from "./SocketManager.js"




export class Room {
    public roomId : string
    
    private doc : string
    private rev : number
    private history : Op[]
    private users : User[]
    
    constructor(initial = "") {
        this.roomId = randomUUID()
        this.doc = initial
        this.rev = 0
        this.history = []
        this.users = []
    }




    receiveOp(op: Op) {
        
    }
}