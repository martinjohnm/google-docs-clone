import { Op, OpType } from "@repo/types/ot-types"
import { applyOp, tieBreak, transformAgainstSequence } from "@repo/ot-core"
import { User } from "../../auth/User.js"
import { DocContent, DocId, DocVersion } from "./RoomTypes.js"
import { MESSAGE_OUTPUT_TYPE } from "@repo/types/ws-types"




export class Room {
    public roomId : DocId
    
    doc : DocContent
    rev : DocVersion
    private history : Op[]
    private users : User[]
    
    constructor(roomId : DocId, initialContent : string, initialVersion : number) {
        this.roomId = roomId
        this.doc = initialContent
        this.rev = initialVersion
        this.history = []
        this.users = []
    }



    addUser(user: User) {
        this.users.push(user)
    }

    receiveOp(op: Op) : MESSAGE_OUTPUT_TYPE {
        const tail = this.history.slice(op.rev)
        const transformed = transformAgainstSequence(op, tail,tieBreak)

        // if transform unsuccessful sent no_op
        if (!transformed) {
            // no op
            
            const no_op = {
                type : OpType.NO_OP, 
                data : {
                    ack : true,
                    applied : false,
                    rev : this.rev,
                    op : null,
                    doc : this.doc
                }
            }

            return no_op
        }

        // apply the transform first if it is valid

        this.doc = applyOp(this.doc, transformed)
        this.history.push(transformed)
        this.rev += 1

        

        // sent events to connected clients

        if (op.type == OpType.INSERT) {

            const insert_op = {
                type : OpType.INSERT, 
                data : {
                    ack : true, 
                    applied : true, 
                    rev : this.rev,
                    op : transformed,
                    doc : this.doc
                }
            }
            return insert_op
            
        } else {
            
            const delete_op = {
                type : OpType.DELETE, 
                data : {
                    ack : true, 
                    applied : true, 
                    rev : this.rev,
                    op : transformed,
                    doc : this.doc
                }
            }
            return delete_op

        }

        
    }
}