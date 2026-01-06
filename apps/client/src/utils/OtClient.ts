import { Op, OpType } from "@repo/types/ot-types"
import { applyOp, tieBreak, transformAgainstSequence } from "@repo/ot-core"
import { MESSAGE_INPUT_TYPE, MESSAGE_OUTPUT_TYPE } from "@repo/types/ws-types"
import { nanoid } from "nanoid"
const ws_url = import.meta.env.VITE_WEBSOCKET_URL


export class OtClient {
    
    clientId : string
    socket : WebSocket
    roomId : string | null
    doc : string
    serverRev : number
    pending : Op[]
    buffer : Op[]
    callback : any | null
    private static instance : OtClient

    private constructor() {
        this.clientId = nanoid()
        this.roomId = null
        this.pending = []
        this.buffer = []
        this.socket = new WebSocket(ws_url)
        this.doc = ""
        this.serverRev = 0
        this.callback = null
        this.receiveMessage()
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new OtClient()
        }
        return this.instance
    }

    localOp(op : Op) : string {
        this.applyLocalOp(op)
        this.sendIfIdle()
        console.log(op);
        
        return this.doc
    }

    setRoomId (roomId : string) {
        this.roomId = roomId
    }

    setCallBack(callback : any) {
        this.callback = callback
    }
    
    private applyLocalOp(op : Op) {
        console.log(op);
        
        applyOp(this.doc, op)
        console.log(this.doc);
        
        if (this.pending.length === 0) {
            this.pending.push(op)
        } else {
            this.buffer.push(op)
        }
        
    }

    private sendIfIdle() {
        if (this.pending.length === 0) return
        const head = this.pending[0]
        
        // sent it to server here
        if (head.type === OpType.DELETE) {
            this.socket.send(JSON.stringify({
                type : OpType.DELETE,
                data : {
                    roomId : this.roomId,
                    op: head
                }
            } as MESSAGE_INPUT_TYPE))
        } else {
            this.socket.send(JSON.stringify({
                type : OpType.INSERT,
                data : {
                    roomId : this.roomId,
                    op : head
                }
            } as MESSAGE_INPUT_TYPE))
        }
        
    }

    private receiveMessage() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as MESSAGE_OUTPUT_TYPE

            if ((message.type === OpType.INSERT || message.type === OpType.DELETE)) {
                // console.log(message);
                
                if (message.data.applied) {
                    this.onServerOp(message.data.op!, message.data.rev, message)
                } else {
                    this.onServerOp(null, message.data.rev, message)
                }
            } 
            
        }
    }

    private onServerOp(serverOp : Op | null, newRev : number, message : any)  {
        if (!serverOp) {
            return
        }

        if (this.pending.length > 0 && serverOp.id === this.pending[0].id && serverOp.clientId === this.clientId) {
            this.pending.shift()
        } else {
            this.doc = applyOp(this.doc, serverOp)

            this.pending = this.pending.map(p => transformAgainstSequence(p, [serverOp], tieBreak)!).filter(Boolean)
            this.buffer = this.buffer.map(b => transformAgainstSequence(b, [serverOp], tieBreak)!).filter(Boolean)
        }


        this.messageReceiverCallback(message, this.callback)

        

        if (this.pending.length === 0 && this.buffer.length > 0) {

            const next = this.buffer.shift()!
            next.rev = newRev
            this.pending.push(next)
            this.sendIfIdle()
        }
        this.serverRev = newRev
    
    }

    messageReceiverCallback(message : MESSAGE_OUTPUT_TYPE, callback: (message : MESSAGE_OUTPUT_TYPE) => any) {
        callback(message)
    }

    
}