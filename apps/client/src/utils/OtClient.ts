import { Op } from "@repo/types/ot-types"
import { applyOp, tieBreak, transformPair } from "@repo/ot-core"
import { MESSAGE_INPUT_TYPE } from "@repo/types/ws-types"





export class OtClient {
    private doc : string
    version : number
    private pendingOp : Op | null = null
    private buffer : Op[] = []
    private roomId : string
    id : string

    private listeners = new Set<(doc : string ) => void>();

    constructor(initialDoc : string, version: number, roomId : string, id : string) {
        this.doc = initialDoc
        this.version = version
        this.roomId = roomId
        this.id = id
    }

    subscribe(listner: (doc: string) => void) {
        this.listeners.add(listner)
        return () => this.listeners.delete(listner)
    }

    private emit() {    
        for (const l of this.listeners) l(this.doc);
    }

    // called by react
    applyLocal(op : Op) : MESSAGE_INPUT_TYPE | null {
        this.doc = applyOp(this.doc, op)
        this.emit()

        if (!this.pendingOp) {
            this.pendingOp = op
            return {
                type : op.type,
                data : {
                    roomId : this.roomId,
                    op
                }
            }
        } else {
            this.buffer.push(op)
            return null
        }
    }



    // called by ws
    applyRemote(op : Op | null, version: number) {

        if (!op) {
            this.version = version
            return
        }

        if (this.pendingOp) {
            const [pendingPrime, remotePrime] = transformPair(this.pendingOp, op, tieBreak)
            this.pendingOp = pendingPrime
            if (remotePrime) {
                op = remotePrime
            }

            
        }

        for (let i =0; i < this.buffer.length; i++) {
            const [bufPrime, remotePrime] = transformPair(this.buffer[i], op, tieBreak)
            
            if (bufPrime) {
                this.buffer[i] = bufPrime
            } else {
                this.buffer.splice(i,1)
                i--
            }

            if (remotePrime) {
                op = remotePrime
            }

            
        }

        this.doc = applyOp(this.doc, op)
        this.version = version
        this.emit()

        

    }

    // called when server ack
    onAck() : MESSAGE_INPUT_TYPE | null {
        this.version ++;
        if (this.buffer.length>0) {
            this.pendingOp = this.buffer.shift()!;
            return {
                type : this.pendingOp.type,
                data : {
                    roomId: this.roomId,
                    op : this.pendingOp
                }
            }
        } else {
            this.pendingOp = null
            return null
        }
    }

    
}