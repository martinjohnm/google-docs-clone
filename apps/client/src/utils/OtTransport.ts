import { Op, OpType } from "@repo/types/ot-types"
import { OtClient } from "./OtClient"
import { MESSAGE_OUTPUT_TYPE, RoomType } from "@repo/types/ws-types"


export class OtTransport {
    
    private ws : WebSocket
    private client : OtClient

    constructor(
        ws: WebSocket, 
        client : OtClient
    ) {

        this.ws = ws
        this.client = client

        ws.onmessage = (e) => {
            const msg = JSON.parse(e.data) as MESSAGE_OUTPUT_TYPE

            
            if (msg.type === OpType.DELETE || msg.type === OpType.INSERT ) {


                if (msg.data.op?.clientId === client.id ) {
                    const next = client.onAck()
                    if (next) ws.send(JSON.stringify(next))
                } else {
                    client.applyRemote(msg.data.op!, msg.data.rev)
                }
                
            }

            if (msg.type === OpType.NO_OP) {
                client.applyRemote(null, msg.data.rev)
            }

        }

    }



    sendLocal(op : Op) {
        const msg = this.client.applyLocal(op)
        if (msg) {
            this.ws.send(JSON.stringify(msg))
        }
    }

}