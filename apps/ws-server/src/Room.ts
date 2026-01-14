import { Op, OpType } from "@repo/types/ot-types"
import { randomUUID } from "crypto"
import { socketManager, User } from "./SocketManager.js"
import { applyOp, tieBreak, transformAgainstSequence } from "@repo/ot-core"




export class Room {
    public roomId : string
    
    doc : string
    rev : number
    private history : Op[]
    private users : User[]
    
    constructor(initial = "") {
        this.roomId = randomUUID()
        this.doc = initial
        this.rev = 0
        this.history = []
        this.users = []
    }



    addUser(user: User) {
        this.users.push(user)
    }

    receiveOp(op: Op) {
        const tail = this.history.slice(op.rev)
        const transformed = transformAgainstSequence(op, tail,tieBreak)

        // if transform unsuccessful sent no_op
        if (!transformed) {
            // no op
            socketManager.broadCast(this.roomId, {
                type : OpType.NO_OP, 
                data : {
                    ack : true,
                    applied : false,
                    rev : this.rev,
                    op : null,
                    doc : this.doc
                }
            })
            return
        }

        // apply the transform first if it is valid

        this.doc = applyOp(this.doc, transformed)
        this.history.push(transformed)
        this.rev += 1

        console.log(this.doc, this.rev, transformed.rev);
        

        // sent events to connected clients

        if (op.type == OpType.INSERT) {

            socketManager.broadCast(this.roomId, {
                type : OpType.INSERT, 
                data : {
                    ack : true, 
                    applied : true, 
                    rev : this.rev,
                    op : transformed,
                    doc : this.doc
                }
            })

            
        } else {
            socketManager.broadCast(this.roomId, {
                type : OpType.DELETE, 
                data : {
                    ack : true, 
                    applied : true, 
                    rev : this.rev,
                    op : transformed,
                    doc : this.doc
                }
            })

        }
    }
}